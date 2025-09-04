#!/usr/bin/env python3
"""
🚀 AI TRADING 2.0 - MT5 Python Bridge Server
Server per la connessione con MetaTrader 5 per trading automatizzato

Installazione dipendenze:
pip install MetaTrader5 flask flask-cors python-dotenv

Uso:
python mt5_bridge.py
"""

import os
import sys
import json
import time
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import MetaTrader5 as mt5
from threading import Timer
import traceback

# Configurazione logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('mt5_bridge.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class MT5Bridge:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app, resources={r"/api/*": {"origins": "*"}})

        # Configurazione MT5
        self.mt5_config = {
            'host': '154.61.187.189',  # IP del VPS
            'port': 8080,
            'login': 67163307,
            'server': 'RoboForex-ECN',
            'path': 'C:\\Program Files\\MetaTrader 5\\terminal64.exe'  # Default path MT5
        }

        self.connected = False
        self.account_info = None
        self.symbols = []
        self.positions = {}
        self.active_orders = []

        # Setup API routes
        self.setup_routes()

        # Auto reconnection timer
        self.reconnect_timer = None

    def setup_routes(self):
        @self.app.route('/health', methods=['GET'])
        def health_check():
            return jsonify({
                'status': 'ok' if self.connected else 'disconnected',
                'timestamp': datetime.now().isoformat(),
                'mt5_version': mt5.version() if mt5.version() else 'N/A'
            })

        @self.app.route('/api/connect', methods=['POST'])
        def connect_mt5():
            """Connette a MT5"""
            try:
                success = self.connect_to_mt5()
                return jsonify({
                    'success': success,
                    'message': 'Connected to MT5 successfully' if success else 'Failed to connect to MT5'
                })
            except Exception as e:
                logger.error(f"Connection error: {str(e)}")
                return jsonify({'success': False, 'error': str(e)}), 500

        @self.app.route('/api/status', methods=['GET'])
        def get_status():
            """Ottieni stato connessione e account MT5"""
            if not self.connected:
                return jsonify({
                    'connected': False,
                    'server': self.mt5_config['server'],
                    'account': self.mt5_config['login']
                })

            return jsonify({
                'connected': True,
                'server': self.mt5_config['server'],
                'account': self.mt5_config['login'],
                'account_info': self.account_info,
                'balance': self.account_info.balance if self.account_info else 0,
                'equity': self.account_info.equity if self.account_info else 0,
                'margin': self.account_info.margin if self.account_info else 0
            })

        @self.app.route('/api/symbols', methods=['GET'])
        def get_symbols():
            """Ottieni tutti i simboli disponibili"""
            try:
                if not self.connected:
                    return jsonify({'error': 'Not connected to MT5'}), 400

                symbols = mt5.symbols_get()
                self.symbols = [symbol.name for symbol in symbols] if symbols else []
                return jsonify({'symbols': self.symbols})
            except Exception as e:
                logger.error(f"Symbols error: {str(e)}")
                return jsonify({'error': str(e)}), 500

        @self.app.route('/api/prices', methods=['GET'])
        def get_prices():
            """Ottieni prezzi attuali per simboli"""
            try:
                if not self.connected:
                    return jsonify({'error': 'Not connected to MT5'}), 400

                symbol = request.args.get('symbol', 'EURUSD')
                tick = mt5.symbol_info_tick(symbol)

                if tick is None:
                    return jsonify({'error': f'No data for symbol {symbol}'}), 404

                return jsonify({
                    'symbol': symbol,
                    'ask': tick.ask,
                    'bid': tick.bid,
                    'spread': tick.ask - tick.bid,
                    'timestamp': datetime.now().isoformat()
                })
            except Exception as e:
                logger.error(f"Prices error: {str(e)}")
                return jsonify({'error': str(e)}), 500

        @self.app.route('/api/order', methods=['POST'])
        def place_order():
            """Esegui un ordine di trading"""
            try:
                if not self.connected:
                    return jsonify({'error': 'Not connected to MT5'}), 400

                data = request.get_json()

                if not data or 'symbol' not in data:
                    return jsonify({'error': 'Missing required parameters'}), 400

                symbol = data['symbol']
                operation = data['operation']  # BUY or SELL
                volume = data.get('volume', 0.01)
                price = data.get('price', 0.0)
                sl = data.get('stoploss', 0.0)
                tp = data.get('takeprofit', 0.0)
                comment = data.get('comment', 'AI Trading 2.0')

                # Prepara richiesta ordine
                request_order = {
                    "action": mt5.TRADE_ACTION_DEAL,
                    "symbol": symbol,
                    "volume": volume,
                    "type": mt5.ORDER_TYPE_BUY if operation.upper() == 'BUY' else mt5.ORDER_TYPE_SELL,
                    "price": price,
                    "sl": sl,
                    "tp": tp,
                    "deviation": 10,
                    "magic": 234000,  # Magic number unico
                    "comment": comment,
                    "type_time": mt5.ORDER_TIME_GTC,
                    "type_filling": mt5.ORDER_FILLING_FOK,
                }

                result = mt5.order_send(request_order)

                if result.retcode != mt5.TRADE_RETCODE_DONE:
                    logger.error(f"Order failed: {result.retcode}")
                    return jsonify({
                        'success': False,
                        'error': f'Order failed: {result.retcode}',
                        'retcode': result.retcode
                    }), 400

                logger.info(f"Order executed: {symbol} {operation} volume={volume}")
                return jsonify({
                    'success': True,
                    'order_id': result.order,
                    'ticket': result.deal,
                    'message': f'Order executed successfully'
                })

            except Exception as e:
                logger.error(f"Order error: {str(e)}")
                return jsonify({'error': str(e)}), 500

        @self.app.route('/api/positions', methods=['GET'])
        def get_positions():
            """Ottieni posizioni aperte"""
            try:
                if not self.connected:
                    return jsonify({'error': 'Not connected to MT5'}), 400

                positions = mt5.positions_get()

                if positions is None or len(positions) == 0:
                    return jsonify({'positions': []})

                positions_data = []
                for pos in positions:
                    positions_data.append({
                        'ticket': pos.ticket,
                        'symbol': pos.symbol,
                        'type': 'BUY' if pos.type == mt5.POSITION_TYPE_BUY else 'SELL',
                        'volume': pos.volume,
                        'open_price': pos.price_open,
                        'current_price': pos.price_current,
                        'profit': pos.profit,
                        'open_time': datetime.fromtimestamp(pos.time).isoformat(),
                        'magic': pos.magic,
                        'comment': pos.comment
                    })

                return jsonify({'positions': positions_data})

            except Exception as e:
                logger.error(f"Positions error: {str(e)}")
                return jsonify({'error': str(e)}), 500

        @self.app.route('/api/close_position', methods=['POST'])
        def close_position():
            """Chiudi una posizione"""
            try:
                if not self.connected:
                    return jsonify({'error': 'Not connected to MT5'}), 400

                data = request.get_json()
                ticket = data.get('ticket')

                if not ticket:
                    return jsonify({'error': 'Ticket required'}), 400

                positions = mt5.positions_get(ticket=ticket)
                if not positions or len(positions) == 0:
                    return jsonify({'error': 'Position not found'}), 404

                pos = positions[0]

                # Prepara richiesta chiusura
                close_request = {
                    "action": mt5.TRADE_ACTION_DEAL,
                    "symbol": pos.symbol,
                    "volume": pos.volume,
                    "type": mt5.ORDER_TYPE_SELL if pos.type == mt5.POSITION_TYPE_BUY else mt5.ORDER_TYPE_BUY,
                    "position": pos.ticket,
                    "price": mt5.symbol_info_tick(pos.symbol).bid if pos.type == mt5.POSITION_TYPE_BUY else mt5.symbol_info_tick(pos.symbol).ask,
                    "deviation": 10,
                    "magic": pos.magic,
                    "comment": "AI Trading Close",
                    "type_time": mt5.ORDER_TIME_GTC,
                    "type_filling": mt5.ORDER_FILLING_FOK,
                }

                result = mt5.order_send(close_request)

                if result.retcode != mt5.TRADE_RETCODE_DONE:
                    return jsonify({
                        'success': False,
                        'error': f'Close failed: {result.retcode}'
                    }), 400

                logger.info(f"Position closed: {ticket}")
                return jsonify({
                    'success': True,
                    'ticket': result.deal,
                    'message': 'Position closed successfully'
                })

            except Exception as e:
                logger.error(f"Close position error: {str(e)}")
                return jsonify({'error': str(e)}), 500

        @self.app.route('/api/account', methods=['GET'])
        def get_account():
            """Ottieni informazioni account"""
            try:
                if not self.connected:
                    return jsonify({'error': 'Not connected to MT5'}), 400

                account = mt5.account_info()
                if account is None:
                    return jsonify({'error': 'Account info not available'}), 500

                return jsonify({
                    'login': account.login,
                    'server': account.server,
                    'name': account.name,
                    'currency': account.currency,
                    'balance': account.balance,
                    'equity': account.equity,
                    'margin': account.margin,
                    'margin_free': account.margin_free,
                    'profit': account.profit,
                    'leverage': account.leverage
                })

            except Exception as e:
                logger.error(f"Account error: {str(e)}")
                return jsonify({'error': str(e)}), 500

    def connect_to_mt5(self):
        """Connette a MT5"""
        try:
            logger.info("Attempting to connect to MT5...")

            # Inizializza MT5
            if not mt5.initialize(path=self.mt5_config['path']):
                logger.error("MT5 initialization failed")
                return False

            logger.info("MT5 initialized successfully")

            # Connetti al server
            if not mt5.login(self.mt5_config['login'], server=self.mt5_config['server']):
                logger.error(f"MT5 login failed for account {self.mt5_config['login']} on {self.mt5_config['server']}")
                mt5.shutdown()
                return False

            logger.info(f"Connected to MT5 account {self.mt5_config['login']} on {self.mt5_config['server']}")

            # Ottieni informazioni account
            self.account_info = mt5.account_info()
            if self.account_info is None:
                logger.error("Failed to get account info")
                mt5.shutdown()
                return False

            self.connected = True
            logger.info(f"MT5 connection successful - Balance: {self.account_info.balance}")

            return True

        except Exception as e:
            logger.error(f"MT5 connection error: {str(e)}")
            self.connected = False
            return False

    def start_reconnection(self):
        """Avvia monitoraggio riconnessione"""
        if self.reconnect_timer:
            self.reconnect_timer.cancel()

        # Controlla connessione ogni 30 secondi
        def check_connection():
            if not self.connected or not mt5.terminal_info() or not mt5.account_info():
                logger.warning("MT5 connection lost, attempting reconnection...")
                self.connect_to_mt5()

            self.reconnect_timer = Timer(30.0, check_connection)
            self.reconnect_timer.start()

        check_connection()

    def run(self):
        """Avvia il server"""
        logger.info("🚀 AI TRADING 2.0 - MT5 Bridge Server starting...")
        logger.info(f"Server will listen on port {self.mt5_config['port']}")

        # Prova connessione iniziale
        self.connect_to_mt5()
        self.start_reconnection()

        try:
            self.app.run(
                host='0.0.0.0',
                port=self.mt5_config['port'],
                debug=False,
                threaded=True
            )
        except KeyboardInterrupt:
            logger.info("Server shutdown requested")
        finally:
            if self.reconnect_timer:
                self.reconnect_timer.cancel()
            mt5.shutdown()
            logger.info("MT5 Bridge Server stopped")


if __name__ == '__main__':
    # Crea e avvia il bridge
    bridge = MT5Bridge()

    try:
        bridge.run()
    except Exception as e:
        logger.error(f"Server crashed: {str(e)}")
        logger.error(traceback.format_exc())
        sys.exit(1)
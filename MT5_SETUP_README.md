# 🚀 AI TRADING 2.0 - MT5 Setup e Configurazione

## Requisiti di Sistema

### VPS Windows (Consigliato)
- **SO**: Windows Server 2019/2022 o Windows 10/11 Pro
- **RAM**: Minimo 8GB (Consigliati 16GB+)
- **CPU**: 4 core (Consigliati 8+ core)
- **Storage**: 100GB SSD
- **Rete**: Connessione stabile con basso latency

### Software Richiesti
- **Python**: 3.7 o superiore
- **MetaTrader 5**: Terminale di trading installato e configurato
- **Account di Trading**: RoboForex ECN account con API trading abilitato

## 🛠️ Installazione del MT5 Bridge

### 1. Installazione Python e Dipendenze
```bash
# Installa Python 3.9+ (se non già installato)
winget install Python.Python.3.9

# Verifica installazione
python --version

# Installa dipendenze necessarie
pip install MetaTrader5 flask flask-cors python-dotenv requests
```

### 2. Scarica e Configura MetaTrader 5
1. Scarica **MetaTrader 5** dal sito di **RoboForex**:
   - Vai su: https://www.roboforex.com/trading-platforms/metatrader5/
   - Scarica e installa la versione per Windows

2. Configura l'account:
   - Apri MT5 Terminal
   - Clicca su "File" → "Login to Trade Account"
   - Inserisci le credenziali:
     - **Login**: `67163307`
     - **Password**: La tua password di trading
     - **Server**: `RoboForex-ECN`

3. Abilita Trading Automatico:
   - Nel MT5, vai su "Tools" → "Options"
   - Clicca su "EA" tab
   - Spunta "Allow automated trading"
   - Spunta "Allow DLL imports"
   - Riavvia il terminale MT5

### 3. Installazione MT5 Bridge Server

```bash
# Copia il file mt5_bridge.py sul tuo VPS Windows
# Nella stessa directory degli altri file del progetto

# Esegui una volta per testare la connessione
python mt5_bridge.py
```

Dovresti vedere in output:
```
🚀 AI TRADING 2.0 - MT5 Bridge Server starting...
Attempting to connect to MT5...
MT5 initialized successfully
Connected to MT5 account 67163307 on RoboForex-ECN
🚀 AI TRADING 2.0 - MT5 Bridge Server listening on port 8080
```

### 4. Avvio Automatico del Server

Per fare partire il server automaticamente quando il VPS si riavvia:

#### Metodo 1: Windows Task Scheduler
1. Apri **Task Scheduler**
2. Crea una nuova task
3. Configura:
   - **Nome**: `AI Trading MT5 Bridge`
   - **Trigger**: "At system startup"
   - **Action**: "Start a program"
   - **Program**: `python`
   - **Arguments**: `C:\path\to\your\mt5_bridge.py`
   - **Directory**: `C:\path\to\your\project`

#### Metodo 2: Script Batch (.bat)
Crea un file `start_mt5_bridge.bat`:
```batch
@echo off
cd /d C:\path\to\your\project
python mt5_bridge.py
pause
```

#### Metodo 3: Windows Service (Avanzato)
Usa NSSM (Non-Sucking Service Manager):
```bash
# Scarica NSSM
nssm install "AI Trading MT5" "python" "C:\path\to\mt5_bridge.py"
nssm start "AI Trading MT5"
```

## 📊 Verifica dell'Installazione

### Test della Connessione
```bash
# Nel browser, vai a:
http://154.61.187.189:8080/health

# Dovresti vedere:
{
  "status": "ok",
  "timestamp": "2025-12-01T12:00:00",
  "mt5_version": "5.0.0.0"
}
```

### Test API MT5
```bash
# Test connessione MT5
curl http://154.61.187.189:8080/api/status

# Test simboli
curl http://154.61.187.189:8080/api/symbols

# Test prezzi
curl "http://154.61.187.189:8080/api/prices?symbol=EURUSD"
```

## 🔧 Configurazioni Avanzate

### Path MT5 Personalizzato
Se MT5 è installato in una directory diversa da quella predefinita, modifica nel file `mt5_bridge.py`:

```python
self.mt5_config = {
    'path': 'C:\\Program Files\\MetaTrader 5\\terminal64.exe',  # Cambia questo path
    # ... altre configurazioni
}
```

### Logging Avanzato
Il server scrive automaticamente i log in `mt5_bridge.log`. Per debug avanzato:
- Modifica `logging.basicConfig(level=logging.DEBUG)` nel file `mt5_bridge.py`
- Riavvia il server

### Monitoraggio
Il server include:
- ✅ Auto-riconnessione ogni 30 secondi
- ✅ Logging dettagliato delle operazioni
- ✅ Health check per monitoraggio esterno
- ✅ Gestione errori robusta

## 🚨 Risoluzione Problemi

### "MT5 initialization failed"
1. Verifica che MT5 sia installato nel path corretto
2. Assicurati che MT5 sia chiuso quando attivi il server
3. Controlla permisso cartelle MT5

### "Login failed"
1. Verifica credenziali MT5 (login, password, server)
2. Assicurati che l'account abbia permessi di trading API
3. Controlla connessione internet

### "Port already in use"
1. Chiudi altri processi che usano la porta 8080
2. Cambia porta nel file `mt5_bridge.py` se necessario
3. Verifica firewall di Windows

### "DLL load failed"
1. In MT5: Tools → Options → EA → Allow DLL imports
2. Riavvia MT5 e il server Python

## 📱 API Reference

### Endpoint Principali
- `GET /health` - Health check del server
- `POST /api/connect` - Connette a MT5
- `GET /api/status` - Stato connessione e account
- `GET /api/symbols` - Lista simboli disponibili
- `GET /api/prices?symbol=EURUSD` - Prezzi attuali
- `POST /api/order` - Esegue ordine di trading
- `GET /api/positions` - Posizioni aperte
- `POST /api/close_position` - Chiude posizione
- `GET /api/account` - Informazioni account

### Esempio Ordine di Trading
```json
POST /api/order
{
  "symbol": "EURUSD",
  "operation": "BUY",
  "volume": 0.01,
  "price": 1.0845,
  "stoploss": 1.0800,
  "takeprofit": 1.0900,
  "comment": "AI Trading Signal"
}
```

## 🔐 Sicurezza

### Firewall
Configura Windows Firewall per permettere solo le connessioni necessarie:
- Porta 8080 per l'API
- Solo dall'IP del tuo server web

### Password MT5
- Usa password sicura e unica per l'account trading
- Abilita 2FA se disponibile
- Non condividere credenziali MT5

### Monitoraggio
- Monitora i log del server regolarmente
- Imposta alert per disconnessioni MT5
- Controlla le operazioni di trading automaticamente

## 📞 Supporto

Per problemi con il setup:
1. Controlla i log del server (`mt5_bridge.log`)
2. Verifica la connessione MT5 manualmente
3. Testa gli endpoint API con curl
4. Contatta il supporto tecnico per domande specifiche

---

**Nota**: Questo sistema è progettato per VPS Windows dedicati al trading. Assicurati di avere tutte le autorizzazioni necessarie per il trading algoritmico con il tuo broker.
// 🚀 CORS Proxy workaround for Vercel backend
// Add this as an API route in your Vercel backend

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://ai-trading-2-0-2.onrender.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Add origin for other domains in Render (future deployments)
  const allowedOrigins = [
    'https://ai-trading-2-0-1.onrender.com',
    'https://ai-trading-2-0.onrender.com',
    'https://ai-trading-2-0-2.onrender.com',
    'http://localhost:3000', // For local development
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // For production, you might want to restrict this further
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  // Relay the request to your actual backend
  // This is just a wrapper - your actual endpoints should be in separate files
}
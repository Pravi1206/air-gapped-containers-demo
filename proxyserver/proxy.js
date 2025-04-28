const http = require('http');
const net = require('net');
const url = require('url');
const moment = require('moment-timezone');

require('dotenv').config();  // Optional, wenn du den -r flag verwendest, ist dies nicht nötig

const getTimestamp = (...args) => {
  return moment().tz('Europe/Berlin').format('YYYY-MM-DD HH:mm:ss')
}

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {

  console.log(`[${getTimestamp()}] Request: ${req.method} ${req.url} `)

  // You can add your proxy logic here
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`[${getTimestamp()}] This is a simple proxy server`);
});

// Handle CONNECT method for HTTPS
proxy.on('connect', (req, clientSocket, head) => {
  const { port, hostname } = url.parse(`//${req.url}`, false, true);
  
  console.log(`[${getTimestamp()}] - CONNECT to ${hostname}:${port}`);
  
  const serverSocket = net.connect(port || 443, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                      'Proxy-agent: Node.js-Proxy\r\n' +
                      '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
  
  serverSocket.on('error', (err) => {
    console.error('Error connecting to server:', err);
    clientSocket.end();
  });
  
  clientSocket.on('error', (err) => {
    console.error('Error on client socket:', err);
    serverSocket.end();
  });
});

// Start the proxy server
const PORT = process.env.PORT || 9090;
proxy.listen(PORT, () => {
  console.log(`[${getTimestamp()}] Proxy server running at http://localhost:${PORT}`);
});
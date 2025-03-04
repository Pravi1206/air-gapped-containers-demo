const http = require('http');
const net = require('net');
const url = require('url');

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // You can add your proxy logic here
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('This is a simple proxy server');
});

// Handle CONNECT method for HTTPS
proxy.on('connect', (req, clientSocket, head) => {
  const { port, hostname } = url.parse(`//${req.url}`, false, true);
  
  console.log(`CONNECT to ${hostname}:${port}`);
  
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
const PORT = 9090;
proxy.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
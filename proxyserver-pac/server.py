from http.server import HTTPServer, SimpleHTTPRequestHandler
from datetime import datetime

PORT: int = 8081

class TimestampedHTTPRequestHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{now}] {self.address_string()} - {format % args}")

if __name__ == '__main__':
    server_address = ('127.0.0.1', PORT)
    httpd = HTTPServer(server_address, TimestampedHTTPRequestHandler)
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    print(f"[{now}] Server running on http://{server_address[0]}:{server_address[1]}")
    httpd.serve_forever()

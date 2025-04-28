import os
import sys
import requests

from datetime import datetime

# import and initialize
from dotenv import load_dotenv
load_dotenv()

# Proxy-Server Konfiguration
proxies = {
    'http': f'http://localhost:{os.getenv("PORT")}',
    'https': f'http://localhost:{os.getenv("PORT")}',
}

def fetch( url: str = 'http://example.com'):
    """ 
        Simple http call using python's request module
    """

    try:
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{now}] - GET - {url}")

        response = requests.get(url, proxies=proxies)

        print(f'[{now}] - Status Code:', response.status_code)
        print(f'[{now}] - Response Body:')
        print(response.text)
    except Exception as e:
        print('Error:', e)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        fetch(sys.argv[1])
    else:
        fetch()
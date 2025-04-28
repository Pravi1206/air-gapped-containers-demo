# Airgapped containers

This repository provides artifacts to showcase the Airgapped Containers feature in Docker Desktop. The architecture consists of the following components:

- Server (on Port 8081): This server provides a ``proxy.pac`` file that defines proxy settings.
- Proxy Server (on Port 9090): The proxy server is referenced by the ``proxy.pac`` file.
- Air-Gapped Container: The container, running an ``app.js`` which is configured to use the ``proxy.pac`` settings

This feature is designed to regulate network requests originating from Docker containers while allowing distinct connectivity rules for the Docker Desktop UI (Electron app).

```plaintext
+-------------------+                +---------------------------+
| Server (Port 8081)|    <----->     |  Proxy Server (Port 9090) |
| (proxy.pac file)  |                |  (Referenced by proxy.pac)|
+-------------------+                +---------------------------+
         |                                      
         |                                      
         v                                      
+-------------------+                    
| Docker Container  |                    
| with app.js       |  <-- Uses proxy.pac
| (air-gapped)      | 
+-------------------+ 
```

# Setting Up the Environment

## Prerequisites

Ensure the following tools are installed on your system:

- **Python**
- **Node.js**
- **Docker Desktop** v.4.31 or higher

## Steps to Set Up

### 1. Start an HTTP Server for the PAC File

Navigate into ``proxyserver-pac`` and run the following command to start a simple HTTP server on port `8081`, serving the PAC file:

```sh
python3 server.py
```

This will start the server with following output

```sh
Server running on http://127.0.0.1:8081
```

### 2. Start the Proxy Server

Navigate into `proxyserver` and install the dependencies

```sh
npm i
```

Execute the following command to start the proxy server:

```sh
npm start
```
> NOTE: this will log something like *Proxy server running at http://localhost:9090*

In case you want to test the server, you can take usage of the provided Python test implementation under ``proxyserver/test``. Install the dependencies and make an example request.

```sh
python3 -m pip install -r requirements.txt
```

Make an example request

```sh
python3 proxyserver/test/requestProxy.py http://google.com
```

### 3. Configure Admin Settings for Docker Desktop

Modify your **`admin-settings.json`** file to include the following section:

```json
"containersProxy": {
  "locked": true,
  "mode": "manual",
  "http": "",
  "https": "",
  "pac": "http://127.0.0.1:8081/proxy.pac",
  "transparentPorts": "*"
}
```

> **Note:**  
> - You can use the `admin-settings.json` provided in this repository.  
> - Ensure this section is copied as-is, except for updating the PAC file path if it's hosted elsewhere.

### 4. Containerize the Test Application
Navigate to the `app` directory and build the Docker image:

```sh
cd app
docker build -t simple-app .
```

---

# Demonstrations

## Demo 1: Proxy Behavior with Allowed and Blocked URLs

The test application attempts to access two external URLs:
- ✅ `example.com` (allowed by the PAC file)
- ❌ `httpbin.org` (blocked by the PAC file)

#### Steps:
1. Start **Docker Desktop**.
2. Run the test application container:

   ```sh
   docker run --rm simple-app
   ```

3. Expected output:

   ```
    Starting to fetch URLs sequentially...
    Attempting to fetch: http://example.com
    Status code for http://example.com: 200
    Successfully fetched http://example.com
    Attempting to fetch: http://httpbin.org/get
    Status code for http://httpbin.org/get: 500
    An error occurred: Request to http://httpbin.org/get failed with status code 500
   ```

   This confirms that the container is only able to access `example.com` while other requests are blocked.

---

## Demo 2: Blocking Network Access for an Ubuntu Container

#### Steps:
1. Run an interactive Ubuntu container:

   ```sh
   docker run -it ubuntu
   ```

2. Attempt to update package repositories:

   ```sh
   apt-get update
   ```

   This command should fail, as the container cannot reach external package repositories due to the proxy restrictions.

---

# Additional Notes

- **Docker CLI & PAC Rules**  
  - Since Docker daemon runs within the same VM as the containers, the same rules apply to docker commands(e.g `docker pull` etc). 
  - To ensure successful image pulls from **Docker Hub**, its domains are already allow-listed in the PAC file.

- **Docker Desktop UI**  
  - Network requests originating from **Docker Desktop UI** will **not** follow the `containersProxy` settings in `admin-settings.json`.
  - In order to control these requests, modify `proxy` section in admin-settings accordingly. 

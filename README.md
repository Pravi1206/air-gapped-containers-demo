# Setting Up the Environment

## Prerequisites

Ensure the following tools are installed on your system:
- **Python**
- **Node.js**

## Steps to Set Up

### 1. Start an HTTP Server for the PAC File
Run the following command to start a simple HTTP server on port `8081`, serving the PAC file:

```sh
python3 -m http.server --bind 127.0.0.1 8081
```

### 2. Start the Proxy Server
Execute the following command to start the proxy server:

```sh
node proxyserver/proxy.js
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
   docker run simple-app
   ```

3. Expected output:

   ```
   Starting to fetch URLs...
   
   --- Sequential Fetching ---
   Attempting to fetch: http://example.com
   Status code for http://example.com: 200
   Successfully fetched http://example.com
   Attempting to fetch: http://httpbin.org/get
   Request to http://httpbin.org/get timed out
   An error occurred: Request timed out
   Error fetching http://httpbin.org/get: socket hang up
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
  - Any Docker CLI command that requires network access (e.g., `docker pull`) will follow PAC file rules.
  - To ensure successful image pulls from **Docker Hub**, its domains are already allow-listed in the PAC file.
  - The Docker daemon itself runs inside a container within the **Docker Desktop VM**, which enforces PAC rules.

- **Docker Desktop UI **  
  - Network requests originating from **Docker Desktop UI** will **not** follow the `containersProxy` settings in `admin-settings.json`.
  - In order to control these requests, modify `proxy` section in admin-settings accordingly. 

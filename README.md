# Setting up the environment

## Prerequisites

Following tools should be available in your system.
- Python
- Node

## 1. Start HTTP server for PAC file

`python3 -m http.server --bind 127.0.0.1 8081`

## 2. Star the proxy server

`node proxyserver/proxy.js`


## 3. Configure admin settings for DD

The following section needs to be added to your <b>admin-settings.json</b>. 

```
  "containersProxy": {
    "locked": true,
    "mode": "manual",
    "http": "",
    "https": "",
    "pac":"http://127.0.0.1:8081/proxy.pac",
    "transparentPorts": "*"
  }
```

You could use the admin-settings.json available in this repository if needed. Ensure the contents of this section is copied as it is(you could change the PAC fie path if it runs in a different location).

## 4. Containerize the test app

```
cd app
docker build -t simple-app .
```


# Demo 1

The test app reaches out to 2 URLs on the internet. 
- example.com
- httpbin.org

The proxy PAC has been configured to only allow example.com. Therefore when we run the app, it should only be able to reach example.com. 

1. Start Docker Desktop
2. Start the test app container

   ` docker run simple-app`

  You should see a similar output as follows.

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

This test ensures the container could only reach example.com which has been allow-listed via the PAC


## Demo 2

1. exec into an ubuntu container

    `docker run -it ubuntu`

2. The following should fail as the container is unable to reach the package repository URLs

    `apt-get update` 

---
### Note

- The docker CLI commands such as which results in network calls(such as `docker pull`) will also obey the PAC rules. Hence the PAC file needs to allow docker domains to successfully pull images from Docker Hub. This has already been allowlisted in the PAC file. 

- The reason for this behaviour is that, the docker daemon also runs within a container within the Docker Desktop VM.

- Any network request originated via the Docker Desktop UI, will not go through the PAC file as it does not honour `containersProxy` settings in admin-settings. 


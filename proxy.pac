function FindProxyForURL(url, host) {
	if (localHostOrDomainIs(host, 'example.com')) {
		return "PROXY 127.0.0.1:9090";
	}
	else if (shExpMatch(host, '*.docker.io')) {
		return "PROXY 127.0.0.1:9090";
	}
	else if (shExpMatch(host, '*.docker.com')) {
		return "PROXY 127.0.0.1:9090";
	}
    return "PROXY 127.0.0.1:9091";
}
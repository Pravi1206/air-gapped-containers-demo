const http = require('http');
const https = require('https');
const moment = require('moment-timezone');

const getTimestamp = (...args) => {
  return moment().tz('Europe/Berlin').format('YYYY-MM-DD HH:mm:ss')
}

function fetchUrl(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    console.log(`[${getTimestamp()}] Attempting to fetch: ${url}`);

    const client = url.startsWith('https') ? https : http;
    const request = client.get(url, (response) => {
      let data = '';

      // Collect response data
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        console.log(`[${getTimestamp()}] Status code for ${url}: ${response.statusCode}`);

        // Reject the promise if the status code is not in the success range (200-299)
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`Request to ${url} failed with status code ${response.statusCode}`));
        } else {
          resolve({
            url,
            statusCode: response.statusCode,
            headers: response.headers,
            data: data.substring(0, 200) + (data.length > 200 ? '...' : '')
          });
        }
      });
    });

    // Handle request errors
    request.on('error', (error) => {
      console.error(`Error fetching ${url}: ${error.message}`);
      reject(error);
    });

    // Set a timeout
    const timeoutId = setTimeout(() => {
      request.destroy();
      reject(new Error(`Request to ${url} timed out after ${timeout}ms`));
    }, timeout);

    request.on('close', () => clearTimeout(timeoutId));
  });
}

async function fetchUrlsSequentially() {
  try {
    console.log(`[${getTimestamp()}] Starting to fetch URLs sequentially...`);

    const result1 = await fetchUrl('http://example.com');
    console.log(`[${getTimestamp()}] Successfully fetched ${result1.url}`);

    const result2 = await fetchUrl('http://httpbin.org/get'); 
    console.log(`[${getTimestamp()}] Successfully fetched ${result2.url}`);

  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

// Run the function
fetchUrlsSequentially();
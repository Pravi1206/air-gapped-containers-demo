const http = require('http');
const https = require('https');

// Function to make an HTTP/HTTPS request
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    console.log(`Attempting to fetch: ${url}`);
    
    // Determine if we should use http or https module
    const client = url.startsWith('https') ? https : http;
    
    const request = client.get(url, (response) => {
      let data = '';
      
      // A chunk of data has been received
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      // The whole response has been received
      response.on('end', () => {
        console.log(`Status code for ${url}: ${response.statusCode}`);
        resolve({
          url,
          statusCode: response.statusCode,
          headers: response.headers,
          data: data.substring(0, 200) + (data.length > 200 ? '...' : '') // Limit output size
        });
      });
    });
    
    // Handle errors
    request.on('error', (error) => {
      console.error(`Error fetching ${url}: ${error.message}`);
      reject(error);
    });
    
    // Set a timeout (5 seconds)
    request.setTimeout(5000, () => {
      request.abort();
      console.error(`Request to ${url} timed out`);
      reject(new Error('Request timed out'));
    });
  });
}

// Define the URLs to fetch
const url1 = 'http://example.com';
const url2 = 'http://httpbin.org/get';

// Fetch both URLs
async function fetchBothUrls() {
  try {
    console.log('Starting to fetch URLs...');
    
    // Option 1: Fetch sequentially
    console.log('\n--- Sequential Fetching ---');
    const result1 = await fetchUrl(url1);
    console.log(`Successfully fetched ${result1.url}`);
    
    const result2 = await fetchUrl(url2);
    console.log(`Successfully fetched ${result2.url}`);
    
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

// Run the function
fetchBothUrls();
// webFunctions.js
import https from 'https';
import http from 'http';
import { URL } from 'url';

function checkUrlStatus(url) {
  return new Promise((resolve) => {
    try {
      const protocol = url.startsWith('https') ? https : http;
      const req = protocol.request(url, { method: 'HEAD' }, (res) => {
        resolve({ url, statusCode: res.statusCode, statusMessage: res.statusMessage });
      });
      req.on('error', (err) => {
        resolve({ url, error: err.message });
      });
      req.end();
    } catch (err) {
      resolve({ url, error: err.message });
    }
  });
}

async function checkMultipleUrlsStatus(urls) {
  const results = await Promise.all(urls.map(checkUrlStatus));
  return results;
}

function getRequest(url) {
  return new Promise((resolve, reject) => {
    try {
      const protocol = url.startsWith('https') ? https : http;
      protocol.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({ url, statusCode: res.statusCode, body: data });
        });
      }).on('error', err => {
        reject({ url, error: err.message });
      });
    } catch (err) {
      reject({ url, error: err.message });
    }
  });
}

export default {
  checkUrlStatus,
  checkMultipleUrlsStatus,
  getRequest
};

// downloadFunctions.js
import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';

function downloadFile(url, destPath) {
  // If destPath is not provided, is a directory, or does not exist, use downloads folder
  let finalDest = destPath;
  let useDefault = false;
  if (!finalDest || finalDest.endsWith('/') || finalDest.endsWith('\\')) {
    useDefault = true;
  } else {
    try {
      const dir = path.dirname(finalDest);
      if (!fs.existsSync(dir)) useDefault = true;
    } catch {
      useDefault = true;
    }
  }
  let fileName = url.split('/').pop().split('?')[0];
  if (useDefault) {
    finalDest = path.join(process.cwd(), 'downloads', fileName);
  }
  // Ensure downloads directory exists
  const downloadsDir = path.join(process.cwd(), 'downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }
  const fileExtension = path.extname(fileName);
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(finalDest);
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, response => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(finalDest, () => {});
        const errMsg = `Failed to get file: HTTP ${response.statusCode} - ${response.statusMessage}`;
        console.error(errMsg);
        reject(new Error(errMsg));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`File downloaded to: ${finalDest}`);
          resolve({ success: true, path: finalDest, extension: fileExtension });
        });
      });
    }).on('error', err => {
      file.close();
      fs.unlink(finalDest, () => {});
      console.error('Download error:', err.message);
      reject(err);
    });
  });
}

export default {
  downloadFile
};

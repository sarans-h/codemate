// fileSystemFunctions.js
import fs from 'fs';
import path from 'path';

function listFiles(directory) {
  try {
    const files = fs.readdirSync(directory);
    return files;
  } catch (err) {
    throw new Error('Unable to list files: ' + err.message);
  }
}

function readFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (err) {
    throw new Error('Unable to read file: ' + err.message);
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true };
  } catch (err) {
    throw new Error('Unable to write file: ' + err.message);
  }
}

export default {
  listFiles,
  readFile,
  writeFile
};

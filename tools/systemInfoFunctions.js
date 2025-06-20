// systemInfoFunctions.js
import os from 'os';
import { exec } from 'child_process';

function getSystemInfo() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalmem: os.totalmem(),
    freemem: os.freemem(),
    uptime: os.uptime(),
    hostname: os.hostname(),
    userInfo: os.userInfo(),
    network: os.networkInterfaces()
  };
}

function getFreeStorage() {
  return new Promise((resolve, reject) => {
    exec('wmic logicaldisk get size,freespace,caption', (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}

function getCpuUsage() {
  return new Promise((resolve) => {
    const startTime  = process.hrtime();
    const startUsage = process.cpuUsage();
    setTimeout(() => {
      const elapTime = process.hrtime(startTime);
      const elapUsage = process.cpuUsage(startUsage);
      const elapTimeMS = elapTime[0] * 1000 + elapTime[1] / 1e6;
      const elapUserMS = elapUsage.user / 1000;
      const elapSystMS = elapUsage.system / 1000;
      const cpuPercent = ((elapUserMS + elapSystMS) / elapTimeMS) * 100;
      resolve({ userMs: elapUserMS, systemMs: elapSystMS, totalMs: elapUserMS + elapSystMS, cpuPercent: cpuPercent.toFixed(2) });
    }, 1000);
  });
}

async function monitorCpuUsage(seconds = 5) {
  for (let i = 0; i < seconds; i++) {
    const usage = await getCpuUsage();
    console.log(`CPU usage at ${new Date().toLocaleTimeString()}:`, usage);
  }
}

export default {
  getSystemInfo,
  getFreeStorage,
  getCpuUsage,
  monitorCpuUsage
};

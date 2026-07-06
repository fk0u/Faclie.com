/* eslint-disable */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow = null;
let nextProcess = null;
const PORT = process.env.PORT || 3000;

function startNextServer() {
  return new Promise((resolve, reject) => {
    const isDev = !app.isPackaged;
    
    // In development, assume Next.js dev server is run externally/concurrently
    if (isDev) {
      console.log('Running in development mode. Connecting to external Next.js server...');
      return resolve();
    }

    console.log('Spawning background Next.js production server...');
    const nextBin = path.join(app.getAppPath(), 'node_modules', 'next', 'dist', 'bin', 'next');
    
    nextProcess = spawn('node', [nextBin, 'start', '-p', PORT.toString()], {
      cwd: app.getAppPath(),
      env: { ...process.env, NODE_ENV: 'production' }
    });

    nextProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Next.js Server]: ${output}`);
      if (output.includes('Ready in') || output.includes('started server')) {
        resolve();
      }
    });

    nextProcess.stderr.on('data', (data) => {
      console.error(`[Next.js Server Error]: ${data}`);
    });

    nextProcess.on('close', (code) => {
      console.log(`Next.js production server process exited with code ${code}`);
    });

    // Fallback: poll server port until it responds
    let attempts = 0;
    const checkServer = setInterval(() => {
      attempts++;
      http.get(`http://localhost:${PORT}`, (res) => {
        if (res.statusCode === 200) {
          clearInterval(checkServer);
          resolve();
        }
      }).on('error', () => {
        if (attempts > 30) {
          clearInterval(checkServer);
          reject(new Error('Next.js server failed to start within 30 seconds.'));
        }
      });
    }, 1000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#0b0f19', // Match Faclie theme
    title: 'Faclie Client Simulator',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  try {
    await startNextServer();
    createWindow();
  } catch (err) {
    console.error('Failed to initialize app:', err);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (nextProcess) {
    nextProcess.kill('SIGINT');
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (nextProcess) {
    nextProcess.kill('SIGINT');
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

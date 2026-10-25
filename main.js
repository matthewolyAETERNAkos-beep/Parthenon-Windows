const { app, BrowserWindow, shell, session, Menu, powerSaveBlocker } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 47821; // fixed port = stable origin = your library & settings are kept
let win = null, origin = '';

if (!app.requestSingleInstanceLock()) { app.quit(); }
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

function startServer() {
  return new Promise((resolve) => {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'));
    const srv = http.createServer((req, res) => {
      const u = req.url.split('?')[0];
      if (u === '/' || u === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(html);
      } else { res.writeHead(404); res.end(); }
    });
    srv.once('error', () => srv.listen(0, '127.0.0.1')); // port busy -> any free port
    srv.on('listening', () => resolve('http://127.0.0.1:' + srv.address().port));
    srv.listen(PORT, '127.0.0.1');
  });
}

async function createWindow() {
  origin = await startServer();
  Menu.setApplicationMenu(null);

  // Local app, so allow what the player needs (folder access, clipboard, etc.)
  session.defaultSession.setPermissionRequestHandler((wc, perm, cb) => cb(true));
  session.defaultSession.setPermissionCheckHandler(() => true);

  win = new BrowserWindow({
    width: 1100, height: 800, minWidth: 360, minHeight: 500,
    backgroundColor: '#1b110c',
    title: 'Parthenon',
    icon: path.join(__dirname, 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      backgroundThrottling: false,            // keep playing when minimized
      autoplayPolicy: 'no-user-gesture-required',
      contextIsolation: true
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(origin)) { e.preventDefault(); shell.openExternal(url); }
  });
  win.on('closed', () => { win = null; });
  win.loadURL(origin + '/');
}

app.whenReady().then(() => {
  powerSaveBlocker.start('prevent-app-suspension'); // Windows won't suspend the app mid-song
  createWindow();
});
app.on('window-all-closed', () => app.quit());

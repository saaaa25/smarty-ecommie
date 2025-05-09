// const { app, BrowserWindow, ipcMain } = require('electron');
// const path = require('path');

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     frame: false, // disables default frame to allow custom buttons
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js')
//     }
//   });

//   win.loadFile('index.html');
// }
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1104,
        height: 621,
        frame: false, // This removes the default title bar
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
}

const { ipcMain } = require('electron');

ipcMain.on('window-close', () => {
    app.quit();
});

ipcMain.on('window-minimize', () => {
    const window = BrowserWindow.getFocusedWindow();
    window.minimize();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
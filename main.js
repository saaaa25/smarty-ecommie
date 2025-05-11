const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { scrapeAmazon } = require('./scrapeAmazon');
const { scrapeEbay } = require('./scrapeEbay');

function createWindow() {
    const win = new BrowserWindow({
        width: 1104,
        height: 621,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
}

// Handle custom window controls
ipcMain.on('window-close', () => {
    app.quit();
});

ipcMain.on('window-minimize', () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) window.minimize();
});

ipcMain.handle('scrape-product', async (event, productName) => {
    try {
        const amazonData = await scrapeAmazon(productName);
        console.log('Amazon results only:', amazonData);
        return amazonData;
    } catch (error) {
        console.error('Error in scraping Amazon:', error);
        return [];
    }
});


app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

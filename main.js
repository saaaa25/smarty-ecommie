const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { scrapeAmazon } = require('./scrapeAmazon');
const { scrapeEbay } = require('./scrapeEbay');
const { scrapeAlibaba } = require('./scrapeAlibaba');
const { scrapeBestBuy } = require('./scrapeBestBuy');
const { scrapeCroma } = require('./scrapeCroma');
const { analyzeProductHistory } = require('./analyzeTrend'); 
const fs = require('fs');
const priceDataPath = path.join(__dirname, 'price_history.json');

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

function addTodayToHistory(productName, price) {
    const today = new Date().toISOString().split('T')[0];
    const historyData = loadHistoricalData();

    if (!historyData[productName]) {
        historyData[productName] = [];
    }

    const existsToday = historyData[productName].some(entry => entry.date === today);
    if (!existsToday) {
        historyData[productName].push({
            date: today,
            price
            // site: "eBay"
        });
    }

    fs.writeFileSync(priceDataPath, JSON.stringify(historyData, null, 2));
}


ipcMain.handle('scrape-product', async (event, productName) => {
    try {
        const historyData = loadHistoricalData();
        const matchedKey = Object.keys(historyData).find(key =>
            key.toLowerCase().includes(productName.toLowerCase())
        );

        //Scrape Amazon and eBay concurrently
        const [amazonDataRaw, ebayDataRaw, alibabaDataRaw, bestbuyDataRaw, cromaDataRaw] = await Promise.all([
            scrapeAmazon(productName),
            scrapeEbay(productName),
            scrapeAlibaba(productName),
            scrapeBestBuy(productName),
            scrapeCroma(productName)
        ]);

        const amazonData = amazonDataRaw || [];
        const ebayData = ebayDataRaw || [];
        const alibabaData = alibabaDataRaw || [];
        const cromaData = cromaDataRaw || [];
        const bestbuyData = bestbuyDataRaw || [];

        //Printing individual results
        console.log('Amazon Results:', amazonData);
        console.log('eBay Results:', ebayData);
        console.log('Alibaba Results:', alibabaData);
        console.log('Best Buy Results:', bestbuyData);
        console.log('Croma Results:', cromaData);


        const combinedLiveData = [...amazonData, ...ebayData, ...alibabaData, ...bestbuyData, ...cromaData];

        //Sorting combined data to find the best (lowest) price
        const sorted = combinedLiveData.sort((a, b) => a.price - b.price);
        const bestToday = sorted.length > 0 ? sorted[0] : null;

        //Appending today’s best price to history if valid
        if (bestToday && !isNaN(bestToday.price)) {
            addTodayToHistory(productName, bestToday.price);
        }

        //If historical data exists, returning analysis with today's scrape
        if (matchedKey) {
            const history = historyData[matchedKey];
            const { analyzeProductHistory } = require('./analyzeTrend');
            const analysis = analyzeProductHistory(history);

            return {
                source: 'historical',
                product: matchedKey,
                history,
                analysis,
                todayScraped: combinedLiveData
            };
        }

        //If there's no history, returnign live scraped data
        return combinedLiveData;

    } catch (error) {
        console.error('❌ Error handling product search:', error);
        return { error: 'Something went wrong' };
    }
});

function loadHistoricalData() {
    if (!fs.existsSync(priceDataPath)) return {};
    const content = fs.readFileSync(priceDataPath, 'utf-8');
    return JSON.parse(content);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

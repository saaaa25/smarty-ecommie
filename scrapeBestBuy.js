const puppeteer = require('puppeteer');

async function scrapeBestBuy(productName) {
    console.log(`Scraping Best Buy for: ${productName}`);
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const url = `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(productName)}`;

    // Try page load with fallback
    try {
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
    } catch (err) {
        console.warn('Initial Best Buy page load failed. Retrying...');
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
    }

    const data = await page.evaluate(() => {
        const results = [];
        const items = Array.from(document.querySelectorAll('[data-testid="list-item"]')).slice(0, 10);
        const today = new Date().toISOString().split('T')[0];
    
        for (const item of items) {
            const titleEl = item.querySelector('[data-testid="product-title"]');
            const priceEl = item.querySelector('[data-testid="price"]');
            const linkEl = item.querySelector('a[href*="/site/"]');
    
            if (!titleEl || !priceEl || !linkEl) continue;
    
            const title = titleEl.textContent.trim();
            const priceStr = priceEl.textContent.replace(/[^0-9.]/g, '');
            const price = parseFloat(priceStr);
            const link = 'https://www.bestbuy.com' + linkEl.getAttribute('href');
    
            if (!isNaN(price)) {
                results.push({
                    site: 'Best Buy',
                    price,
                    timestamp: today,
                    title,
                    link
                });
            }
        }
    
        return results;
    });
    

    await browser.close();
    return data;
}

module.exports = { scrapeBestBuy };

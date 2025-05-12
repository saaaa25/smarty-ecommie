const puppeteer = require('puppeteer');

async function scrapeEbay(productName) {
    console.log(`Scraping eBay for: ${productName}`);
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(productName)}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000  // 60 seconds
    });
    

    const data = await page.evaluate(() => {
        const results = [];
        const items = Array.from(document.querySelectorAll('.s-item')).slice(0, 15);
        const today = new Date().toISOString().split('T')[0];

        items.forEach(item => {
            const titleEl = item.querySelector('.s-item__title');
            const priceEl = item.querySelector('.s-item__price');
            const linkEl = item.querySelector('.s-item__link');

            if (titleEl && priceEl && priceEl.innerText.includes('$')) {
                const title = titleEl.innerText.trim();
                const priceStr = priceEl.innerText.replace(/[^\d.]/g, '');
                const price = parseFloat(priceStr);

                results.push({
                    site: 'eBay',
                    price: isNaN(price) ? null : price,
                    timestamp: today,
                    title,
                    link: linkEl ? linkEl.href : ''
                });
            }
        });

        return results.filter(r => r.price !== null);
    });

    await browser.close();
    return data;
}

module.exports = { scrapeEbay };

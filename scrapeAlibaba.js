const puppeteer = require('puppeteer');

async function scrapeAlibaba(productName) {
    console.log(`Scraping Alibaba for: ${productName}`);
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto(`https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(productName)}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });

    const data = await page.evaluate(() => {
        const results = [];
        const items = Array.from(document.querySelectorAll('.J-offer-wrapper'));
        const today = new Date().toISOString().split('T')[0];

        items.forEach(item => {
            const titleEl = item.querySelector('.elements-title-normal__outter');
            const priceEl = item.querySelector('.elements-offer-price-normal__price');
            const linkEl = item.querySelector('a');

            if (!titleEl || !priceEl || !linkEl) return;

            const title = titleEl.innerText.trim();
            const priceStr = priceEl.innerText.replace(/[^0-9.]/g, '');
            const price = parseFloat(priceStr);
            const link = linkEl.href;

            if (!isNaN(price)) {
                results.push({
                    site: 'Alibaba',
                    price,
                    timestamp: today,
                    title,
                    link
                });
            }
        });

        return results;
    });

    await browser.close();
    return data;
}

module.exports = { scrapeAlibaba };

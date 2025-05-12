const puppeteer = require('puppeteer');

async function scrapeAmazon(productName) {
    console.log(`Scraping Amazon for: ${productName}`);
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112 Safari/537.36');

    await page.goto(`https://www.amazon.com/s?k=${encodeURIComponent(productName)}`, {
        waitUntil: 'networkidle2',
        timeout: 60000
    });

    const data = await page.evaluate(() => {
        const results = [];
        const items = Array.from(document.querySelectorAll('.s-main-slot .s-result-item'));
        const today = new Date().toISOString().split('T')[0];

        items.forEach(item => {
            const titleEl = item.querySelector('h2');
            const priceEl = item.querySelector('.a-price .a-offscreen');
            const linkEl = item.querySelector('h2 a');

            if (!titleEl || !priceEl || !linkEl) return;

            const title = titleEl.innerText.trim();
            const priceStr = priceEl.innerText.replace(/[^0-9.]/g, '');
            const price = parseFloat(priceStr);
            const link = linkEl.getAttribute('href') || '';

            if (!link.includes('/dp/') && !link.includes('/gp/') && !link.includes('/sspa/')) return;

            results.push({
                site: 'Amazon',
                price: isNaN(price) ? null : price,
                timestamp: today,
                title,
                link: linkEl ? linkEl.href : ''
            });
        });

        return results;
    });

    await browser.close();
    return data;
}

module.exports = { scrapeAmazon };


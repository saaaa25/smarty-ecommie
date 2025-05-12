const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeCroma(productName) {
    console.log(`🟢 Scraping Croma for: ${productName}`);
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36'
    );

    const url = `https://www.croma.com/searchB?q=${encodeURIComponent(productName)}:relevance`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Give time for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 5000));

    const data = await page.evaluate(() => {
        const results = [];
        const items = Array.from(document.querySelectorAll('.product-list__item')).slice(0, 10);
        const today = new Date().toISOString().split('T')[0];

        items.forEach(item => {
            const titleEl = item.querySelector('.product-title') || item.querySelector('h3');
            const priceEl = item.querySelector('.new-price');
            const linkEl = item.querySelector('a');

            if (titleEl && priceEl && linkEl) {
                const title = titleEl.innerText.trim();
                const priceStr = priceEl.innerText.replace(/[₹,]/g, '').trim();
                const price = parseFloat(priceStr);
                const link = 'https://www.croma.com' + linkEl.getAttribute('href');

                if (!isNaN(price)) {
                    results.push({
                        site: 'Croma',
                        title,
                        price,
                        link,
                        timestamp: today
                    });
                }
            }
        });

        return results;
    });

    await browser.close();
    return data;
}

module.exports = { scrapeCroma };
 
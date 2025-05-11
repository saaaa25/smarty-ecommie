from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
from datetime import datetime

def scrape_amazon(product_name, headless=True):
    # Set Chrome options
    options = Options()
    if headless:
        options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument('--disable-gpu')
    options.add_argument("window-size=1920,1080")

    # Initialize driver
    driver = webdriver.Chrome(options=options)

    try:
        query = product_name.replace(" ", "+")
        url = f"https://www.amazon.in/s?k={query}"
        driver.get(url)
        time.sleep(10)  # wait for JS to render

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        driver.quit()

        results = soup.select('[data-component-type="s-search-result"]')
        print("Number of products found:", len(results))

        products = []
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        for idx, item in enumerate(results, 1):
            try:
                title_elem = item.select_one('h2 span')
                price_elem = item.select_one('.a-price span.a-offscreen')
                link_elem = item.select_one('.s-title-instructions-style a')

                if not title_elem:
                    print(f"[{idx}] Skipped: No title")
                    continue
                if not price_elem:
                    print(f"[{idx}] Skipped: No price")
                    continue
                if not link_elem:
                    print(f"[{idx}] Skipped: No link")
                    continue

                title = title_elem.get_text(strip=True)
                price = float(price_elem.get_text(strip=True).replace("₹", "").replace(",", ""))
                link = "https://www.amazon.in" + link_elem['href']

                print(f"[{idx}] Product: {title} | ₹{price} | {link}")

                products.append({
                    "name": title,
                    "price": price,
                    "url": link,
                    "timestamp": timestamp
                })

            except Exception as e:
                print(f"[{idx}] Error: {e}")

        return products

    except Exception as e:
        print("Scraping error:", e)
        driver.quit()
        return []

# TEST RUN
if __name__ == "__main__":
    results = scrape_amazon("wireless mouse", headless=False)  # set headless=True if confident
    for r in results:
        print(r)

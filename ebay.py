from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
from datetime import datetime

def scrape_ebay(product_name, headless=True, limit=5):
    
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
        url = f"https://www.ebay.com/sch/i.html?_nkw={query}"
        driver.get(url)
        time.sleep(12)  # Wait for JS to render

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        driver.quit()

        results = soup.select('li.s-item')
        print("Number of eBay products found:", len(results))

        products = []
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        found = 0

        for idx, item in enumerate(results):
            if found >= limit:
                break

            try:
                # Try all possible title sources
                title_elem = item.select_one('h3.s-item__title')
                if title_elem is None or "New Listing" in title_elem.text:
                    title_elem = item.select_one('div.s-item__title')
                if title_elem is None or not title_elem.text.strip() or "Shop on eBay" in title_elem.text:
                    title_elem = item.select_one('img.s-item__image-img')
                    title = title_elem['alt'] if title_elem and title_elem.has_attr('alt') else ""
                else:
                    title = title_elem.get_text(strip=True)

                # Clean title
                if not title.strip() or title == "New Listing":
                    print(f"[{idx+1}] Skipped: Invalid title")
                    continue

                price_elem = item.select_one('span.s-item__price')
                link_elem = item.select_one('a.s-item__link')

                if not price_elem or not link_elem:
                    print(f"[{idx+1}] Skipped: Missing price or link")
                    continue

                # Clean price
                price_text = price_elem.get_text(strip=True).replace("$", "").replace(",", "")
                try:
                    price = float(price_text.split()[0])
                except ValueError:
                    print(f"[{idx+1}] Skipped: Invalid price format -> {price_text}")
                    continue

                link = link_elem['href']

                print(f"[{idx+1}] Product: {title} | ${price} | {link}")
                products.append({
                    "name": title,
                    "price": price,
                    "url": link,
                    "timestamp": timestamp
                })
                found += 1

            except Exception as e:
                print(f"[{idx+1}] Error: {e}")
                continue

        return products

    except Exception as e:
        print("Scraping error:", e)
        driver.quit()
        return []



from operator import itemgetter

# Example function to analyze price trends for a given product
def analyze_price_trends(product_name):
    if product_name not in product_data:
        print(f"Product {product_name} not found.")
        return
    
    price_history = product_data[product_name]
    # Sort price history by timestamp (ascending order)
    price_history.sort(key=itemgetter('timestamp'))
    
    # Extract the sorted prices for trend analysis
    prices = [entry['price'] for entry in price_history]
    
    print(f"\n\nPrice Trend for {product_name}: {prices}")
    
    # You can implement more sophisticated analysis here like detecting spikes, etc.
    # For now, just return the sorted prices
    return prices

def detect_price_spike(prices, threshold=10.0):
    """
    Detect significant price spikes (e.g., more than 10% increase)
    in the price history.
    """
    spikes = []
    for i in range(1, len(prices)):
        price_diff = prices[i] - prices[i-1]
        if price_diff > threshold:  # If price increase is more than threshold
            spikes.append((i, prices[i-1], prices[i]))
    
    return spikes

def predict_best_buy_time(product_name):
    prices = analyze_price_trends(product_name)
    if not prices:
        return None

    min_price = min(prices)
    best_time = prices.index(min_price)  # Index where the minimum price occurred

    print(f"\n\nThe best time to buy {product_name} is at index {best_time}, when the price was {min_price}.\n")
    return best_time

# Main entry point for scraping, analyzing, and interacting with the user
if __name__ == "__main__":
    product_name = input("\nEnter the product name: ")
    
    # Scrape data for the product
    print("\n\nScraping data...\n\n")
    results = scrape_ebay(product_name)

    product_data = {}
    
    # Store data in hash table
    for product in results:
        name = product['name']
        if name not in product_data:
            product_data[name] = []
        product_data[name].append({
            "price": product['price'],
            "url": product['url'],
            "timestamp": product['timestamp']
        })

    # Debugging step: Print out all product names in product_data
    print("\n\nProduct data stored:")
    for product_name in product_data:
        print(product_name)  # This will show all product names in lowercase

    # Analyze price trends
    analyze_price_trends(product_name)
    
    if product_name in product_data:
        price_spikes = detect_price_spike([entry['price'] for entry in product_data[product_name]])
    else:
        print(f"\n\nProduct '{product_name}' not found in product_data.")
    
    # Suggest best time to buy
    predict_best_buy_time(product_name)



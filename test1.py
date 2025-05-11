from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
from datetime import datetime

def scrape_amazon(product_name, headless=True, limit=5):
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

        # Limit the number of products scraped to 'limit' (e.g., 5)
        for idx, item in enumerate(results[:limit], 1):  # Use slicing to limit to 'limit' items
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
    
    print(f"Price Trend for {product_name}: {prices}")
    
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

# Example usage
# prices = analyze_price_trends("wireless mouse")
# price_spikes = detect_price_spike(prices)
# if price_spikes:
#     print("Detected price spikes:", price_spikes)

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
    results = scrape_amazon(product_name)

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



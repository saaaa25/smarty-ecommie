import json
import random
from datetime import datetime, timedelta

def generate_history(product_name, base_price, start_date_str="2025-05-02", days=7):
    history = []
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")

    price = base_price
    for i in range(days):
        date = start_date + timedelta(days=i)
        change = (random.random() - 0.5) * 5  # Simulate ±2.5 fluctuation
        price = max(5, price + change)
        price = round(price, 2)

        history.append({
            "date": date.strftime("%Y-%m-%d"),
            "price": price
        })

    return history

# Define product base prices and start dates
products = {
    "Logitech Mouse": (24.99, "2025-05-05"),
    "SteelSeries Pad": (29.99, "2025-05-05"),
    "USB-C Charger": (19.99, "2025-05-05"),
    "Amazon Echo Dot": (49.99, "2025-05-05"),
    "Wireless Keyboard": (34.99, "2025-05-05")
}

# Generate price histories
price_history = {
    name: generate_history(name, base_price, start_date, days=7)
    for name, (base_price, start_date) in products.items()
}

# Save to JSON
with open("synthetic_price_history.json", "w") as f:
    json.dump(price_history, f, indent=2)

print("✅ 7-day synthetic price history saved to 'synthetic_price_history.json'")

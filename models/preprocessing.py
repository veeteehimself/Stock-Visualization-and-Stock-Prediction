import pandas as pd

def AlphaVantageApi_URL_LINK(stock_symbol):
    # api_key = 'EDOF97Z0B2DGU669'
    # base_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY'
    # output_size = 'full'

    url_link = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=EDOF97Z0B2DGU669&outputsize=full'
    return url_link

stock_symbol = 'AAPL'  # Replace 'AAPL' with your desired stock symbol
api_url = AlphaVantageApi_URL_LINK(stock_symbol)
print(api_url)



import requests

# Define the AlphaVantage API URL
def apiCall(stock):
    alpha_vantage_url = AlphaVantageApi_URL_LINK(stock)

    # Make the GET request to the API
    response = requests.get(alpha_vantage_url)
    if response.status_code == 200:
        data = response.json()['Time Series (Daily)']
        stockMarketHistoryPrices = []
        
        # Process the data
        for date, entry in data.items():
            closingPrice = entry["4. close"]
            stockMarketHistoryPrices.insert(0, closingPrice)
        return pd.DataFrame(stockMarketHistoryPrices, columns=['close'])
    return []

print(apiCall("AAPL"))

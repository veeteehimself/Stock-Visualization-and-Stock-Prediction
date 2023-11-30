import pandas as pd
import json
def AlphaVantageApi_URL_LINK(stock_symbol):
    # api_key = 'EDOF97Z0B2DGU669'
    # base_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY'
    # output_size = 'full'
    url_link = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+stock_symbol+'&apikey=1D3K0720M9O7Q63N&outputsize=full'

    return url_link


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
            close = entry["4. close"]
            stockMarketHistoryPrices.insert(0, close)
        df = pd.DataFrame(stockMarketHistoryPrices, columns=['close'], dtype='float64')
        return df
    return []

from datetime import datetime
import os

def readJson(ticker):

    try:
        link = AlphaVantageApi_URL_LINK(ticker)
        print("THE CURRENT PATH IS: ",os.getcwd())
        file_path = f"./api/stocks/saved/{datetime.now().isoformat().split('T')[0]}{ticker}.json"
        print(file_path)

        if os.path.exists(file_path):
            with open(file_path, 'r') as file:
                info = json.load(file)
                res = []
                for entry in info.items():
                    close = entry[1]['4. close']
                    res.insert(0, close)
                df = pd.DataFrame(res, columns=['close'], dtype='float64')
                return df
        else:
            response = requests.get(
                link,
            )
            data = response.json()
            info = data['Time Series (Daily)']
            print(info)

            with open(file_path, 'w') as file:
                json.dump(info, file)

            prices = [float(prices['4. close']) for prices in reversed(info.values())]
            df = pd.DataFrame(prices, columns=['close'], dtype='float64')
            return df


    except Exception as e:
        print(e)
        # print(result)
    # except Exception as error:
    #     print('THE FREAKING ERROR IS ')
    #     print(error)
    #     result = {
    #         'message': 'Error fetching data',
    #         'error': str(error),
    #     }
    #     print(result)

    # data  = requests.get("http://localhost:8080/stock/?ticker="+ ticker)
    # print(data)
    # res = []
    # for entry in data.items():
    #     close = entry[1]['4. close']
    #     res.insert(0, close)
    # df = pd.DataFrame(res, columns=['close'], dtype='float64')
    # return df

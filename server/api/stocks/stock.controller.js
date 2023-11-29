// const Stock = require('./stock.model.js');
const { existsSync, writeFileSync } = require('fs');
const { key } = require('../../config.json');
const axios = require('axios');

const getStocks = async (req, res) => {
    try {
        const { ticker } = req.query;

        let info;
        if (existsSync(`./api/stocks/saved/${new Date(Date.now()).toISOString().split("T")[0]}${ticker}.json`)) {
            info = require(`./saved/${new Date(Date.now()).toISOString().split("T")[0]}${ticker}.json`);

        } else {
            const { data } = await axios({
                method: 'GET',
                url: 'https://www.alphavantage.co/query',
                params: {
                    symbol: ticker,
                    apikey: key,
                    function: 'TIME_SERIES_DAILY',
                    outputsize: 'full',
                },
            });
            console.log(data)
            info = data['Time Series (Daily)'];
            console.log(info);
            writeFileSync(
                `./api/stocks/saved/${new Date(Date.now()).toISOString().split("T")[0]}${ticker}.json`,
                JSON.stringify(info)
            );
        }

        res.status(200).send({
            message: 'Success',
            dates: Object.keys(info)
                .map((date) => date.replaceAll('-', '/'))
                .reverse(),
            prices: Object.values(info)
                .map((prices) => prices['4. close'])
                .reverse(),
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error fetching data',
            error,
        });
    }
};

module.exports = { getStocks };

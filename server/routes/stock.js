const { key } = require('../config.json');
const { writeFileSync, existsSync } = require('fs');
const router = require('express').Router();
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        const { ticker } = req.query;
        const localStock = `./stocks/${ticker}.json`;

        if (existsSync(localStock)) {
            info = require(`.${localStock}`);
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
            info = data['Time Series (Daily)'];
            writeFileSync(`./stocks/${ticker}.json`, JSON.stringify(info));
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
        res.status(500).send({
            message: 'Error fetching data',
            error,
        });
    }
});

module.exports = router;

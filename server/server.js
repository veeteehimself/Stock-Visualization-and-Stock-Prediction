const config = require('./config.json');
const axios = require('axios');
const express = require('express');
const cors = require('cors');

const mongo = require("./mongo");

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get('/stock', async (req, res) => {
    try {
        const { ticker } = req.query;
        // const { data } = await axios({
        //     method: 'GET',
        //     url: 'https://www.alphavantage.co/query',
        //     params: {
        //         symbol: ticker,
        //         apikey: config.key,
        //         function: 'TIME_SERIES_DAILY',
        //         outputsize: 'full',
        //     },
        // });
        // const info = data['Time Series (Daily)'];
        const info = require(`./stocks/${ticker}.json`);

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

app.use("/users", require("./api/users/user.routes.js"));
app.use("/positions", require("./api/positions/position.routes"));

app.listen(port, async () => {
    await mongo.connectDB();
    console.log(`Listening on port ${port}`);
});
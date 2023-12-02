import axios from 'axios';

const formatDate = (date) => date.split("T")[0].split("-").join("/");

const getStockPrice = async (ticker, date) => {
    try {
        const res = await axios({
            method: "GET",
            url: `http://localhost:8080/stock?ticker=${ticker}`
        })
        const { prices, dates } = res.data;

        if(dates.indexOf(formatDate(date))===-1){
            return prices[prices.length-1];
        }

        // console.log(console.log(res.data.data));
        return prices[dates.indexOf(formatDate(date))];
    } catch (error) {
        console.log(error);
    }
}

const getValue = async () => {
    try {
        const res = await axios({
            method: "GET",
            url: "http://localhost:8080/positions"
        });

        let totalValue = 10000;
        for (const position of res.data) {
            const openingPrice = await getStockPrice(position.ticker, position.opened);
            const closingPrice = position.closed ? await getStockPrice(position.ticker, position.closed) : await getStockPrice(position.ticker, new Date(Date.now()).toISOString());

            if (openingPrice && closingPrice)
                totalValue += closingPrice - openingPrice;
        }
        return totalValue;
    } catch (error) {
        console.log(error);
        auth.status.error = true;
        auth.errorMsg = error;
    }
}

const getAvailableMoney = async () => {
    try {
        const res = await axios({
            method: "GET",
            url: "http://localhost:8080/positions"
        });

        let totalValue = 10000;
        for (const position of res.data) {
            const openingPrice = await getStockPrice(position.ticker, position.opened);

            if(position.closed) {
                const closingPrice = await getStockPrice(position.ticker, position.closed);
                totalValue += closingPrice - openingPrice;
            } else {
                totalValue -= openingPrice;
            }
        }
        return totalValue;
    } catch (error) {
        console.log(error);
        auth.status.error = true;
        auth.errorMsg = error;
    }
}

export default {
    formatDate, getStockPrice, getValue, getAvailableMoney
}
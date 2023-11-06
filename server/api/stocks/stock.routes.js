const { getStocks } = require('./stock.controller.js');
const router = require('express').Router();

router.get('/', getStocks);

module.exports = router;

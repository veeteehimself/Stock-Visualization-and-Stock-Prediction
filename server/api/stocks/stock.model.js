const { Schema, model } = require('mongoose');

const StockSchema = new Schema({});

module.exports = new model('Stock', StockSchema);

const mongoose = require("mongoose");

const PositionSchema = new mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    ticker: String,
    opened: { type: Date, default: Date.now },
    closed: Date
});

const Position = new mongoose.model("Position", PositionSchema);

module.exports = Position;
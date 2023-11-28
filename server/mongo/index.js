const { connect } = require('mongoose');
const { username, password, cluster, project } = require('../config.json');
const Position = require('../api/positions/position.model.js');
// const Stock = require('../api/stocks/stock.model.js');
const User = require('../api/users/user.model.js');

const connectDB = async () => {
    try {
        await connect(
            `mongodb+srv://${username}:${password}@${cluster}.6g2ne4p.mongodb.net/${project}?retryWrites=true&w=majority`
        );
        console.log('Connected to Mongo DB');
    } catch (error) {
        console.log(error);
    }
};

const clearDB = async () => {
    await connectDB();
    await Position.deleteMany({});
    // await Stock.deleteMany({});
    await User.deleteMany({});
};

module.exports = { connectDB, clearDB };

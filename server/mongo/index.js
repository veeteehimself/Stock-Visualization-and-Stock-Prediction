const mongoose = require("mongoose");

const { username, password, projectname } = require("./config.json");
const mongoURL = `mongodb+srv://${username}:${password}@5337usersbackend.6g2ne4p.mongodb.net/${projectname}?retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log("Connected to Mongo DB");
    } catch(error) {
        console.log(error);
    }
};

module.exports = { connectDB };
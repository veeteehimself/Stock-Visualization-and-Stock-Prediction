const express = require('express');
const cors = require('cors');

const mongo = require("./mongo");

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.use('/stock', require('./routes/stock.js'));

app.use("/users", require("./api/users/user.routes.js"));
app.use("/positions", require("./api/positions/position.routes"));

app.listen(port, async () => {
    await mongo.connectDB();
    console.log(`Listening on port ${port}`);
});
const express = require("express");

const mongo = require("./mongo");

const app = express();
const port = 8080;

app.use(express.json());

app.use("/users", require("./api/users/user.routes.js"));
app.use("/positions", require("./api/positions/position.routes"));

app.listen(port, async () => {
    await mongo.connectDB();
    console.log(`Listening on port ${port}`);
});




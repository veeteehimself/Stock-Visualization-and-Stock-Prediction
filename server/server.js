const { connectDB } = require('./mongo');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.use('/positions', require('./api/positions/position.routes.js'));
app.use('/stock', require('./api/stocks/stock.routes.js'));
app.use('/users', require('./api/users/user.routes.js'));
app.use('/compiler', require('./api/compiler/compiler.routes.js'));

app.listen(port, async () => {
    await connectDB();
    console.log(`Listening on port ${port}`);
});

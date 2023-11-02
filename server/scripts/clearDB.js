const User = require("../api/users/user.model");
const Position = require("../api/positions/position.model");

const { connectDB } = require("./utilsDB");
const { username, password, projectname } = require("config");

connectDB();

const execScript = async () => {
    // clean existing data
    await User.deleteMany({});
    await Position.deleteMany({});
};

execScript();
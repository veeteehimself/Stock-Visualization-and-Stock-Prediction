const User = require("./user.model");

const saveUser = async (req, res) => {
    const newUser = req.body;

    const userDoc = new User(newUser);

    try {
        saved = await userDoc.save();
        req.json(saved);
    } catch(error) {
        res.status(500).json({ error: error.toString() });
    }
}

const getUsers = async (req, res) => {
    const { query } = req;
    const username = query.username;

    let filter = {};

    if(username) {
        filter = { username: { $regex: username, $options: "i" }}
    }

    try {
        const users = await User.find(filter).populate("positions");
        res.json(users);
    } catch(error) {
        res.status(500).json({ error: error.toString() });
    }
}

const getUserById = async (req, res) => {
    const { params } = req;
    const id = params.id;

    try {
        const user = await User.findOne({
            _id: id
        }).populate("positions");
        
        if(user) {
            res.json(user);
        } else {
            res.status(404).json({ error: `No user found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}




const testUser = {
    username: "beta",
    password: "12345",
}

module.exports = { getUsers, getUserById };
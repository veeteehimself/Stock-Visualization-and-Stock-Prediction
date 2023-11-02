const User = require("./user.model");

const getUsers = async (req, res) => {
    const { query } = req;
    const username = query.username;

    let filter = {};

    if (username) {
        filter = { username: { $regex: username, $options: "i" } }
    }

    try {
        const users = await User.find(filter).populate("positions");
        res.json(users);
    } catch (error) {
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

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: `No user found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

const saveUser = async (req, res) => {
    const { body } = req;

    try {
        const userDoc = new User(body);

        saved = await userDoc.save();
        res.json(saved);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

const updateUser = async (req, res) => {
    const { params, body } = req;
    const id = params.id;

    try {
        updated = await User.findOneAndUpdate({ _id: id }, body);

        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ error: `No user found by id: ${id}` })
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

const deleteUser = async (req, res) => {
    const { params } = req;
    const id = params.id;

    try {
        const deleted = await User.deleteOne({ _id: id });
        res.json(deleted);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

module.exports = { getUsers, getUserById, saveUser, updateUser, deleteUser };
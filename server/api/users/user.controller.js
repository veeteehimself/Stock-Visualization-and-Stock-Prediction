const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const config = require("../../config.json");
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
    const { params, user } = req;
    const id = user.id;

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

        const salt = await bcrypt.genSalt(10);
        userDoc.password = await bcrypt.hash(userDoc.password, salt);

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

const loginUser = async (req, res) => {
    const { username, password } = req.params;

    try {
        const user = await User.findOne({ username: { $regex: username, $options: "i" } });

        if(user) {
            authenticated = await bcrypt.compare(password, user.password);
            if(authenticated) {
                const token = jwt.sign(
                    { id: user._id, username: user.username },
                    config.jwtsecret,
                    { expiresIn: '24h' }
                );

                const authorized = user.toObject();

                // remove the password key
                delete authorized.password;

                res.header('Authorization', `Bearer ${token}`).header("Access-Control-Expose-Headers","Authorization").json(authorized);
            } else {
                res.status(401).json({ error: "invalid password" });
            }
        } else {
            res.status(401).json({ error: "invalid username" });
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { getUsers, getUserById, saveUser, updateUser, deleteUser, loginUser };
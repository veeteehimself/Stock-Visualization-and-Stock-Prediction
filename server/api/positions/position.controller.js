const Position = require("./position.model");

const getPositions = async (req, res) => {
    const { query } = req;
    const ticker = query.ticker;
    const userId = query.userId;

    let filter = {};

    if (ticker) {
        filter.ticker = { $regex: ticker, $options: "i" };
    }

    if (userId) {
        filter.userId = { $regex: userId };
    }

    try {
        const positions = await Position.find(filter);
        res.json(positions);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

const getPositionById = async (req, res) => {
    const { params } = req;
    const id = params.id;

    try {
        const position = await Position.findOne({
            _id: id
        });

        if (position) {
            res.json(position);
        } else {
            res.status(404).json({ error: `No position found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

const savePosition = async (req, res) => {
    const { body } = req;

    try {
        const positionDoc = new Position(body);

        saved = await positionDoc.save();
        res.json(saved);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

const closePosition = async (req, res) => {
    const { params } = req;
    const id = params.id;

    try {
        updated = await Position.findOneAndUpdate({ _id: id }, { closed: Date.now() });

        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ error: `No position found by id: ${id}` })
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

const deletePosition = async (req, res) => {
    const { params } = req;
    const id = params.id;

    try {
        const deleted = await Position.deleteOne({ _id: id });
        res.json(deleted);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

module.exports = { getPositions, getPositionById, savePosition, closePosition, deletePosition };
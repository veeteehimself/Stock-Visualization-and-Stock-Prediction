const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    created: { type: Date, default: Date.now }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

UserSchema.virtual("positions", {
    ref: "Position",
    localField: "_id",
    foreignField: "userId"
})

const User = new mongoose.model("User", UserSchema);

module.exports = User;
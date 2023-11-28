const router = require("express").Router();

const controller = require("./user.controller");

const middleware = require("../middleware/authorization");

router.get("/", controller.getUsers);

router.get("/view", middleware.verifyToken, controller.getUserById);

router.post("/", controller.saveUser);

router.put("/:id", middleware.verifyToken, controller.updateUser);

router.delete("/:id", middleware.verifyToken, controller.deleteUser);

router.post("/login/:username/:password", controller.loginUser);

module.exports = router;
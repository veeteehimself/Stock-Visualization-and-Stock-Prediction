const router = require("express").Router();

const controller = require("./user.controller");

router.get("/", controller.getUsers);

router.get("/:id", controller.getUserById);

router.post("/", controller.saveUser);

router.put("/:id", controller.updateUser);

router.delete("/:id", controller.deleteUser);

module.exports = router;
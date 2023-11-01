const router = require("express").Router();

const controller = require("./user.controller");

router.get("/", controller.getUsers);

router.get("/:id", controller.getUserById);

router.post("/");

router.put("/:id");

router.delete("/:id");

module.exports = router;
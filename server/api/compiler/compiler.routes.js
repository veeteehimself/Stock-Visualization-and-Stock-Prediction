const router = require("express").Router();

const controller = require("./compiler.controller");
router.get("/:stock", controller.runFile);


module.exports = router;
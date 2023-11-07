const router = require("express").Router();

const controller = require("./compiler.controller");
router.get("/", controller.runFile);


module.exports = router;
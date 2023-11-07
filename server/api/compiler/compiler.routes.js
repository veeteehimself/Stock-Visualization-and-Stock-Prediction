const router = require("express").Router();

const controller = require("./position.controller");

router.get("/", controller.runFile);


module.exports = router;
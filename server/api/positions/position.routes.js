const router = require("express").Router();

const controller = require("./position.controller");

router.get("/");

router.get("/:id");

router.post("/");

router.put("/:id");

router.delete("/:id");

module.exports = router;
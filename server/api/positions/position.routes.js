const router = require("express").Router();

const controller = require("./position.controller");

const middleware = require("../middleware/authorization");

router.use(middleware.verifyToken);

router.get("/", controller.getPositions);

router.get("/:id", controller.getPositionById);

router.post("/", controller.savePosition);

router.put("/:id", controller.closePosition);

router.delete("/:id", controller.deletePosition);

module.exports = router;
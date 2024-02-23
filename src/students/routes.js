const { Router } = require("express");
const controller = require("./controller");

// student router:
const route = Router();
route.get("/", controller.getStudents);
route.get("/:id", controller.getStudentsById);

module.exports = route;
//1

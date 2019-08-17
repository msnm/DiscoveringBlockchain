"use strict";
const express = require("express");
const router = express.Router();
const url = require("url");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require('path');
const departmentsPath = "../data/departments.json";

router.get("/", getDepartments);
router.get("/patient/:patientId", getDepartmentsOfPatient);
router.get("/:departmentId", getDepartment);
router.use(bodyParser.json());

function getDepartments(req, resp) {
    let deps = readDepartmentsFromDB();
    resp.json(deps).status(200);
}

function getDepartmentsOfPatient(req, resp) {
    let deps = readDepartmentsFromDB();
    deps = deps.find(dep => dep.rooms.find(room => room.beds.find(bed => bed.patientId === +req.params.patientId) !== undefined) !== undefined);
    resp.json(deps).status(200);
}
function getDepartment(req, resp) {
    let dep = readDepartmentsFromDB();
    console.log(+req.params.departmentId);
    dep = dep.find(dep => dep.id === +req.params.departmentId);
    if(dep) {
        resp.json(dep).status(200);
    }
    else {
        resp.status(404);
    }
}

function readDepartmentsFromDB() {

    const json = fs.readFileSync(path.resolve(__dirname, departmentsPath));
    return JSON.parse(json);
}

module.exports = router;

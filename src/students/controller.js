const db = require("../../DataBase");
const studentQuarries = require("./studentsql");

// const db = require("../../DataBase");
// const studentQuarries = require("./studentsql");
const express = require('express');
const app = express();
app.get('/login', (req, res) => {
    let loginRequest = req.body();
    loginRequest.userName();
    loginRequest.userPassword();

    res.send('hello world')
  })

const getStudents = (req, res) => {
  db.query(studentQuarries.getStudentsList, (error, results) => {
    if (error) throw error;

    res.status(200).json(results.rows);
  });
};
const getStudentsById = (req, res) => {
  const id = parseInt(req.params.id);
  db.query(studentQuarries.getStudentById, [id], (error, results) => {
    // if multiple then we can pass like [id,name,age ,email]
    if (error) throw error;

    res.status(200).json(results.rows);
  });
};

module.exports = {
  getStudents,
  getStudentsById,
};

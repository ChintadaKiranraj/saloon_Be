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



// convert into base64Converter:
// function base64Converter(object){
//     let jsonObject = JSON.stringify(object);
//     let base64ConvertValue = Buffer.from(jsonObject).toString("base64");
//     console.log(base64ConvertValue);
//     return base64ConvertValue;
// }


// decode base64Converter
// function base64ToJson(base64String){
//     const convertJson = Buffer.from(base64String, "base64").toString();
//     return JSON.parse(convertJson);
// }

// app.get('/', (request, response) => {
//     response.send("Hello raj")
// })

// app.get('/fetch-login-details', async (req,res)=>{
//     console.log("statred fetch login details");
//     try{
//     const result1 = await databaseConnection.dbConnection();
//     const result = await result1.query(querysIs.fetchLoginDetails);
//     console.log(result.rows);
//     const arrayData = new Array();
//     result.rows.forEach(function(e){
//         arrayData.push(e);
//     })
//     res.send(arrayData)
//     console.log("Successfully completed fetch details");
//     }catch(err){
//         console.log(err);
//     }
// });

// app.post('/upload-admin-details', async (req,res) =>{
//     try{
//     let response = req.body;
//     const connection = await databaseConnection.dbConnection();
//     // await connection.query('INSERT INTO admin(name,number) VALUES(\'manikanta1\',\'79972615\')');
//    let responseForDatabase = await connection.query(querysIs.insertInLogin,[response.name,response.number]);
//     res.send(responseForDatabase.rows)
//     }catch(err){
//         console.log(err);
//     }

// });
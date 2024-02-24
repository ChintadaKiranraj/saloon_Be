const { response } = require('express');
const express = require('express')
const databaseConnection = require('./DataBase')
const querysIs = require('./src/students/studentsql')
const studentRouter = require("./src/students/routes")
const app = express()

const PORT = 4001;
app.use(express.json());
app.listen(PORT, () => console.log(`app is listening at ${PORT}`))

app.get('/', (request, response) => {
    response.send("Hello raj")
})

app.get('/fetch-login-details', async (req,res)=>{
    console.log("statred fetch login details");
    try{
    const result1 = await databaseConnection.dbConnection();
    const result = await result1.query(querysIs.fetchLoginDetails);
    console.log(result.rows);
    const arrayData = new Array();
    result.rows.forEach(function(e){
        arrayData.push(e);
    })
    res.send(arrayData)
    console.log("Successfully completed fetch details");
    }catch(err){
        console.log(err);
    }
});


app.post('/upload-admin-details', async (req,res) =>{
    try{
    let response = req.body;
    const connection = await databaseConnection.dbConnection();
    // await connection.query('INSERT INTO admin(name,number) VALUES(\'manikanta1\',\'79972615\')');
   let responseForDatabase = await connection.query(querysIs.insertInLogin,[response.name,response.number]);
    res.send(responseForDatabase.rows)
    }catch(err){
        console.log(err);
    }

});

app.post('/save-registration', async (req,res)=>{
    let response = {};
    let ary = new Array();
    try{
    const request = req.body;
    const connection = await databaseConnection.dbConnection();
    const executeQuery = await connection.query(querysIs.saveRegistration,[request.emailId,request.firstName,request.lastName,request.phoneNumber,request.password,request.confirmPassword]);
    response.message="Successfully registrationed";
    response.status=true;
    response.registration = executeQuery.rows;
    ary.push(response);
    console.log(ary)
    res.send(ary);
    }catch(err){
        console.log(err.message);
        response.message = "Faild to registration";
        response.status = false;
        response.message = err.message;
        res.send(response);
    }
})
// class loginDto{
//     constructor(name,number){
//         this.name = name;
//         this.number = number;
//     }
//     set setName(name){
//         this.name = name;
//     }
//     set setNumber(number){
//         this.number = number;
//     }
// }

app.use("/api/v1/students", studentRouter)



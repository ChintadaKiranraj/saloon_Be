const { response } = require('express');
const express = require('express')
const databaseConnection = require('./DataBase')
const querysIs = require('./src/students/studentsql')
const studentRouter = require("./src/students/routes")
const encodeDecode = require('./src/students/EncodeDecode')
const app = express()

const PORT = 4001;
app.use(express.json());
app.listen(PORT, () => console.log(`app is listening at ${PORT}`))

//Registratation Rest Api's

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
});

app.post('/validate-resgistratation-login-user', async (req,res)=>{
    let response = {};
    try{
    registration = req.body;
    const connection = await databaseConnection.dbConnection();
    const executeQuery = await connection.query(querysIs.validateLoginUser,[registration.emailId,registration.password]);
    connection
    if(executeQuery.rows.length != 0){
     let ss =  encodeDecode.base64Converter(executeQuery.rows[0])
    //  let dd = encodeDecode.base64ToJson(ss);
    response.message = "Valide user details";
    response.status = true;
    response.data = ss;
    }else{
    response.message = "User not found";
    response.status = false;
    }
    }catch(err){
        response.message = err.message;
        response.status = false;
    }
    res.send(response);

});
class registration{
    constructor(emailId,firstName,lastName,password,phoneNumber,confirmPassword){
        this.emailId = emailId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.confirmPassword =confirmPassword;
    }
}


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

app.use("/api/v1/students", studentRouter)



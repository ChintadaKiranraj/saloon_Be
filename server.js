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

app.post('/save-registration', async (req, res) => {
    let response = {};
    try {
        const request = req.body;
        const connection = await databaseConnection.dbConnection();
        const executeQuery = await connection.query(querysIs.saveRegistration, [request.emailId, request.firstName, request.lastName, request.phoneNumber, request.password, request.confirmPassword]);
        let encodeData = encodeDecode.base64Converter(executeQuery.rows);
        response.message = "Successfully registrationed";
        response.status = true;
        response.data = encodeData;
        console.log(response)
        res.send(response);
    } catch (err) {
        console.log(err.message);
        response.message = "Faild to registration";
        response.status = false;
        response.data = "";
        response.message = err.message;
        res.send(response);
    }
});

app.post('/validate-resgistratation-login-user', async (req, res) => {
    let response = {};
    try {
        registration = req.body;
        const connection = await databaseConnection.dbConnection();
        const executeQuery = await connection.query(querysIs.validateLoginUser, [registration.emailId, registration.password]);
        connection
        if (executeQuery.rows.length != 0) {
            let ss = encodeDecode.base64Converter(executeQuery.rows[0])
            //  let dd = encodeDecode.base64ToJson(ss);
            response.message = "Valide user details";
            response.status = true;
            response.data = ss;
        } else {
            response.message = "User not found";
            response.status = false;
            response.data = "";
        }
    } catch (err) {
        response.message = err.message;
        response.status = false;
        response.data = "";
    }
    res.send(response);

});
class registration {
    constructor(emailId, firstName, lastName, password, phoneNumber, confirmPassword) {
        this.emailId = emailId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.confirmPassword = confirmPassword;
    }
}

app.post('/save-booking-details', async (req, res) => {
    let response = {};
    try {
        bookingDetails = req.body;
        const connection = await databaseConnection.dbConnection();
        const executedQuerysIs = await connection.query(querysIs.saveBookingDetails, [bookingDetails.name, bookingDetails.date, bookingDetails.time, bookingDetails.status]);
        if (executedQuerysIs.rows.length != 0) {
            let queryResult = encodeDecode.base64Converter(executedQuerysIs.rows[0]);
            response.message = "Successfully upload booking details";
            response.status = true;
            response.data = queryResult;
        } else {
            response.message = "unable to save the connection";
            response.status = false;
            response.data = "";
        }
    } catch (err) {
        response.message = err.message;
        response.status = false;
        response.data = "";
    }
    res.send(response);
});

app.get('/fetch-booking-details', async (req,res)=>{
    try{
    let request = req.body;
    const connect = await databaseConnection.dbConnection();
    bookingDetails = await connect.query(querysIs.fetchBookingDetails);
    res.send(encodeDecode.base64Converter(bookingDetails.rows));
    }catch(err){
        res.send(err.message);
    }
});

app.put('/update-booking-details', async (req,res)=>{
    let response = {};
    try{
    bookingDetails = req.body;
    const connection = await databaseConnection.dbConnection();
    const executeQuery = await connection.query(querysIs.updateBookingDetails,[bookingDetails.status,bookingDetails.id]);
    if(executeQuery.rows.length == 0){
        response.message = "unbale to update the status";
        response.status = false;
        response.data = "";
        res.send(response);
    }
    response.message = "Sucessfully update the user";
        response.status = true;
        response.data = encodeDecode.base64Converter(executeQuery.rows);
        res.send(response);

}catch(err){
    response.message = err.message;
        response.status = false;
        response.data = "";
        res.send(response);   
}
});

app.delete('/detele-booking-users', async (req,res)=>{
    let response = {};
    let arr = new Array();
    try{
    let request = req.body;
    const connection = await databaseConnection.dbConnection();
    bookingDetails = await connection.query(querysIs.deleteBookingDetails,[request.id]);
    if(bookingDetails.rows.length != 0){
        let deletedDetails = encodeDecode.base64Converter(bookingDetails.rows);
        response.message = "Sucessfully deleted";
        response.status = true;
        response.data = deletedDetails;
        res.send(response);

    }else{
        response.message = "unable to deleted";
        response.status = false;
        response.data = "";
        res.send(response);
    }
}catch(err){
    response.message = err.message;
    response.status = false;
    response.data = "";
    res.send(response);
}
})

class bookingDetails {
    constructor(id, name, date, time, status) {
        this.id = id;
        this.name = name;
        this.data = date;
        this.time = time;
        this.status = status;
    }
}

app.use("/api/v1/students", studentRouter)



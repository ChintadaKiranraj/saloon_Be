const { response } = require('express');
const nodeMailer = require("nodemailer");
const { sendEmail } = require('./src/students/sendMail')
const express = require('express')
const databaseConnection = require('./DataBase')
const querysIs = require('./src/students/studentsql')
const studentRouter = require("./src/students/routes")
const encodeDecode = require('./src/students/EncodeDecode')
// var cors = require('cors')
const app = express()
const cors = require("cors");
   app.use(cors({
   origin: 'http://localhost:3000',
   optionsSuccessStatus: 200,
   credentials: true,
}));
const PORT = 4001;
app.use(express.json());
app.listen(PORT, () => console.log(`app is listening at ${PORT}`))

//Registratation Rest Api's

app.post('/save-registration', async (req, res) => {
    console.log("Stared the registraction");
    let response = {};
    try {
        registration = req.body;
        const connection = await databaseConnection.dbConnection();
        const executeQuery = await connection.query(querysIs.saveRegistration, [registration.emailId, registration.firstName, registration.lastName, registration.phoneNumber, registration.password, registration.confirmPassword,registration.accessLevel]);
        let encodeData = encodeDecode.base64Converter(executeQuery.rows);
        //SEND MAIL START
        if(registration.accessLevel==1){
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: '587',
            service: 'gmail',
            auth: {
                user: 'yogendramanikanta9951@gmail.com',
                pass: 'xwrxqbvgldqegtll',
            },
        });
        const mailOptions = {
            from: request.emailId,
            to: 'yogendramanikanta9951@gmail.com',
            subject: 'Requesting for admin access',
            html: 'Could you please provied admin access',
        };
        await transporter.sendMail(mailOptions);
    }
        //SENT MAIL END
        response.message = "Successfully registrationed";
        response.status = true;
        response.data = encodeData;
        console.log("Successfully completed registraction");
        res.send(response);
    } catch (err) {
        console.error(err.message);
        response.message = "Faild to registration";
        response.status = false;
        response.data = "";
        response.message = err.message;
        res.send(response);
    }
});

app.post('/validate-resgistratation-login-user', async (req, res) => {
    console.log("testing")
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
            response.accessLevel = executeQuery.rows[0].access_level
        } else {
            response.message = "User not found";
            response.status = false;
            response.data = "";
            res.status(400);
        }
    } catch (err) {
        response.message = err.message;
        response.status = false;
        response.data = "";
        res.status(400);
    }
    res.send(response);

});
class registration {
    constructor(emailId, firstName, lastName, password, phoneNumber, confirmPassword,accessLevel) {
        this.emailId = emailId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.confirmPassword = confirmPassword;
        this.accessLevel = accessLevel;
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
    console.log("Stared featch booking details");
    try{
    const connect = await databaseConnection.dbConnection();
    bookingDetails = await connect.query(querysIs.fetchBookingDetails);
    let response = encodeDecode.base64Converter(bookingDetails.rows);
    console.log("Successfully Completed")
    res.send(response);
    }catch(err){
        console.error(err.message);
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


app.post('/sendMail', async (req)=>{
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: '587',
        service: 'gmail',
        auth: {
            user: 'yogendramanikanta9951@gmail.com',
            pass: 'xwrxqbvgldqegtll',
        },
    });

    const mailOptions = {
        from: 'yogendramanikanta9951@gmail.com',
        to: 'kiranrajchintada302@gmail.com',
        subject: 'sample test',
        html: '',
    };
    // console.log(mailOptions);
    // console.log(transporter);
    await transporter.sendMail(mailOptions);
    
})

app.get('/fetch-registraction-details', async (req,res)=>{
    console.log("Stared fetch registration details");
    let response = {};
    try{
        let connection = await databaseConnection.dbConnection();
        const executedQuery = await connection.query(querysIs.featchRegistratationDetails);
        let result = encodeDecode.base64Converter(executedQuery.rows);
        response.message = "Successfully fetch details"
        response.status = true;
        response.data = result;
        console.log("Successfully completed");
        res.send(response);
    }catch(err){
        console.error(err.message);
        response.message = err.message;
        response.status = false;
        response.data = "";
        res.send(response)
    }
})

app.use("/api/v1/students", studentRouter)



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

async function queryExecutionResult(query, varibles) {
    const connect = await databaseConnection.dbConnection();
    const result = await connect.query(query, varibles);
    const resultData = result.rows;
    connect.close;
    return resultData;

}
//Registratation Rest Api's

app.post('/save-registration', async (req, res) => {
    console.log("Stared the registraction");
    let response = {};
    try {
        registration = req.body;
        let payload = [registration.emailId, registration.firstName, registration.lastName, registration.phoneNumber, registration.password, registration.confirmPassword, registration.accessLevel];
        const executeQuery = await queryExecutionResult(querysIs.saveRegistration, payload)
        let encodeData = encodeDecode.base64Converter(executeQuery);
        //SEND MAIL START
        if (registration.accessLevel == 1) {
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
        let payload = [registration.emailId, registration.password];
        const executeQuery = await queryExecutionResult(querysIs.validateLoginUser, payload)
        if (executeQuery.length != 0) {
            let ss = encodeDecode.base64Converter(executeQuery)
            response.message = "Valide user details";
            response.status = true;
            response.data = ss;
            response.accessLevel = executeQuery[0].access_level
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
    constructor(emailId, firstName, lastName, password, phoneNumber, confirmPassword, accessLevel) {
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
    console.log("Started save booking details API");
    let response = {};
    try {
        bookingDetails = req.body;
        let payload = [bookingDetails.name, bookingDetails.date, bookingDetails.time, bookingDetails.status];
        const executedQuerysIs = await queryExecutionResult(querysIs.saveBookingDetails, payload)
        if (executedQuerysIs.length != 0) {
            let queryResult = encodeDecode.base64Converter(executedQuerysIs[0]);
            response.message = "Successfully upload booking details";
            response.status = true;
            response.data = queryResult;
            console.log("Completed save booking details API");
        } else {
            response.message = "unable to save the connection";
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

app.get('/fetch-booking-details', async (req, res) => {
    console.log("Stared featch booking details");
    try {
        bookingDetails = await queryExecutionResult(querysIs.fetchBookingDetails)
        let response = encodeDecode.base64Converter(bookingDetails);
        console.log("Successfully Completed")
        res.send(response);
    } catch (err) {
        console.error(err.message);
        res.status(400);
        res.send(err.message);
    }
});

app.put('/update-booking-details', async (req, res) => {
    let response = {};
    try {
        bookingDetails = req.body;
        let payload = [bookingDetails.status, bookingDetails.id];
        const executeQuery = await queryExecutionResult(querysIs.updateBookingDetails, payload)
        if (executeQuery.length == 0) {
            response.message = "unbale to update the status";
            response.status = false;
            response.data = "";
            res.send(response);
        }
        response.message = "Sucessfully update the user";
        response.status = true;
        response.data = encodeDecode.base64Converter(executeQuery);
        res.send(response);

    } catch (err) {
        response.message = err.message;
        response.status = false;
        response.data = "";
        res.send(response);
    }
});

app.delete('/detele-booking-users', async (req, res) => {
    let response = {};
    try {
        let request = req.body;
        bookingDetails = await queryExecutionResult(querysIs.deleteBookingDetails, [request.id])
        if (bookingDetails.length != 0) {
            let deletedDetails = encodeDecode.base64Converter(bookingDetails);
            response.message = "Sucessfully deleted";
            response.status = true;
            response.data = deletedDetails;
            res.send(response);

        } else {
            response.message = "unable to deleted";
            response.status = false;
            response.data = "";
            res.send(response);
        }
    } catch (err) {
        response.message = err.message;
        response.status = false;
        response.data = "";
        res.send(response);
    }
});

class bookingDetails {
    constructor(id, name, date, time, status) {
        this.id = id;
        this.name = name;
        this.data = date;
        this.time = time;
        this.status = status;
    }
}

app.post('/sendMail', async (req) => {
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
    await transporter.sendMail(mailOptions);
});

app.get('/fetch-registraction-details', async (req, res) => {
    console.log("Stared fetch registration details");
    let response = {};
    try {
        const executedQuery = await queryExecutionResult(querysIs.featchRegistratationDetails);
        let result = encodeDecode.base64Converter(executedQuery);
        response.message = "Successfully fetch details"
        response.status = true;
        response.data = result;
        console.log("Successfully completed");
        res.send(response);
    } catch (err) {
        console.error(err.message);
        response.message = err.message;
        response.status = false;
        response.data = "";
        res.send(response)
    }
});

app.use("/api/v1/students", studentRouter)



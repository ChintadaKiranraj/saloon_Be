// const { response } = require('express');
// const nodeMailer = require("nodemailer");
// const express = require('express')
// const databaseConnection = require('./DataBase')
// const querysIs = require('./src/students/studentsql')
// const studentRouter = require("./src/students/routes")
// const encodeDecode = require('./src/students/EncodeDecode')
// // var cors = require('cors')
// require('dotenv').config()
// const app = express()
// const cors = require("cors");
// app.use(cors({
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200,
//     credentials: true,
// }));
// const PORT = 4001;
// app.use(express.json());

// app.listen(PORT, () => console.log(`<-----------The app is listening at port ${PORT}----------->.`));


// async function queryExecutionResult(query, varibles) {
//     const connect = await databaseConnection.dbConnection();
//     const result = await connect.query(query, varibles);
//     const resultData = result.rows;
//     connect.release();
//     return resultData;

// }

// function successCase(data) {
//     let response = {};
//     let encodeData = encodeDecode.base64Converter(data);
//     response.message = "Successfully";
//     response.status = true;
//     response.data = encodeData;
//     return response;
// }

// function exceptionCase(messagre){
//     let errorResult = {};
//     errorResult.message = messagre;
//     errorResult.status = false;
//     errorResult.data = "";
//     return errorResult;

// }
// //Registratation Rest Api's

// app.post('/save-registration', async (req, res) => {
//     console.log("Stared the registraction");
//     let response = {};
//     try {
//         registration = req.body;
//         let payload = [registration.emailId, registration.firstName, registration.lastName, registration.phoneNumber, registration.password, registration.confirmPassword, registration.accessLevel];
//         const executeQuery = await queryExecutionResult(querysIs.saveRegistration, payload)
//         //SEND MAIL START
//         if (registration.accessLevel == 1) {
//             const transporter = nodeMailer.createTransport({
//                 host: process.env.SMPT_HOST,
//                 port: process.env.SMPT_PORT,
//                 service: process.env.SMPT_SERVICE,
//                 auth: {
//                     user: process.env.AUTH_USER,
//                     pass: process.env.AUTH_PASS,
//                 },
//             });
//             const mailOptions = {
//                 from: request.emailId,
//                 to: process.env.MAIL_TO_USER,
//                 subject: 'Requesting for admin access',
//                 html: 'Could you please provied admin access',
//             };
//             await transporter.sendMail(mailOptions);
//         }
//         //SENT MAIL END
//         response = successCase(executeQuery)
//         console.log("Successfully completed registraction");
//         res.send(response);
//     } catch (err) {
//         console.error(err.message);
//         response = exceptionCase(err.message);
//         res.send(response);
//     }
// });

// app.post('/validate-resgistratation-login-user', async (req, res) => {
//     console.log("started Validate Resgistratation Login User :");
//     let response = {};
//     try {
//         registration = req.body;
//         let payload = [registration.emailId, registration.password];
//         const executeQuery = await queryExecutionResult(querysIs.validateLoginUser, payload)
//         if (executeQuery.length != 0) {
//             response = successCase(executeQuery);
//             response.accessLevel = executeQuery[0].access_level
//             console.log("Completed Validate Resgistratation Login User :");
//             res.send(response);
//         } else {
//             response = exceptionCase("User not found");
//             console.log("Something went to rong!. Validate Resgistratation Login User :");
//             res.status(400);
//             res.send(response);
//         }
//     } catch (err) {
//         console.log(err.message);
//         response = exceptionCase(err.message);
//         res.status(400);
//         res.send(response);
//     }

// });
// class registration {
//     constructor(emailId, firstName, lastName, password, phoneNumber, confirmPassword, accessLevel) {
//         this.emailId = emailId;
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.password = password;
//         this.phoneNumber = phoneNumber;
//         this.confirmPassword = confirmPassword;
//         this.accessLevel = accessLevel;
//     }
// }

// app.post('/save-booking-details', async (req, res) => {
//     console.log("Started save booking details API");
//     let response;
//     try {
//         bookingDetails = req.body;
//         let payload = [bookingDetails.name, bookingDetails.date, bookingDetails.time, bookingDetails.status];
//         const executedQuerysIs = await queryExecutionResult(querysIs.saveBookingDetails, payload)
//         if (executedQuerysIs.length != 0) {
//             response = successCase(executedQuerysIs);
//             console.log("Completed save booking details API");
//             res.send(response);
//         } else {
//             console.log("unable save the connection")
//             response = exceptionCase("unable to save the connection");
//             res.status(400);
//             res.send(response);
//         }
//     } catch (err) {
//         response = exceptionCase(err.message);
//         console.log(err.message);
//         res.status(400);
//         res.send(response);
//     }
    
// });

// app.get('/fetch-booking-details', async (req, res) => {
//     console.log("Stared featch booking details");
//     let response;
//     try {
//         bookingDetails = await queryExecutionResult(querysIs.fetchBookingDetails)
//         console.log("response" + bookingDetails);
//         // let response = encodeDecode.base64Converter(bookingDetails);
//         response = successCase(bookingDetails);
//         console.log("Successfully Completed")
//         res.send(response);
//         // res.send(response);
//     } catch (err) {
//         console.error(err.message);
//         response = exceptionCase(err.message);
//         res.status(400);
//         res.send(response);
//     }
// });

// app.put('/update-booking-details', async (req, res) => {
//     let response = {};
//     try {
//         bookingDetails = req.body;
//         let payload = [bookingDetails.status, bookingDetails.id];
//         const executeQuery = await queryExecutionResult(querysIs.updateBookingDetails, payload)
//         if (executeQuery.length == 0) {
//             response = exceptionCase("unbale to update the status");
//             res.send(response);
//         }
//         response = successCase(executeQuery);
//         res.send(response);

//     } catch (err) {
//         response = exceptionCase(err.message);
//         res.send(response);
//     }
// });

// app.delete('/detele-booking-users', async (req, res) => {
//     let response;
//     try {
//         let request = req.body;
//         bookingDetails = await queryExecutionResult(querysIs.deleteBookingDetails, [request.id])
//         if (bookingDetails.length != 0) {
//             response = successCase(bookingDetails);
//             res.send(response);

//         } else {
//             response = exceptionCase("unable to deleted");
//             res.status(400);
//             res.send(response);
//         }
//     } catch (err) {
//         response = exceptionCase(err.message);
//         res.status(400);
//         res.send(response);
//     }
// });

// class bookingDetails {
//     constructor(id, name, date, time, status) {
//         this.id = id;
//         this.name = name;
//         this.data = date;
//         this.time = time;
//         this.status = status;
//     }
// }

// app.post('/sendMail', async (req) => {
//     const transporter = nodeMailer.createTransport({
//         host: process.env.SMPT_HOST,
//         port: process.env.SMPT_PORT,
//         service: process.env.SMPT_SERVICE,
//         auth: {
//             user: process.env.AUTH_USER,
//             pass: process.env.AUTH_PASS,
//         },
//     });

//     const mailOptions = {
//         from: 'yogendramanikanta9951@gmail.com',
//         to: process.env.MAIL_TO_USER,
//         subject: 'sample test',
//         html: '',
//     };
//     await transporter.sendMail(mailOptions);
// });

// app.get('/fetch-registraction-details', async (req, res) => {
//     console.log("Stared fetch registration details");
//     let response;
//     try {
//         const executedQuery = await queryExecutionResult(querysIs.featchRegistratationDetails);
//         response = successCase(executedQuery);
//         console.log("Successfully completed");
//         res.send(response);
//     } catch (err) {
//         console.error(err.message);
//         response = exceptionCase(err.message);
//         res.status(400);
//         res.send(response)
//     }
// });

// app.use("/api/v1/students", studentRouter)



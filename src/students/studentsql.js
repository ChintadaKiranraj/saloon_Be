const getStudentsList = "SELECT * FROM students";
const getStudentById = "SELECT * FROM students WHERE id=$1";
const insertInLogin = "INSERT INTO admin(name,number) VALUES($1,$2) RETURNING *";
const fetchLoginDetails = "SELECT * FROM admin";
const saveRegistration = "INSERT INTO registration (email_id,first_name,last_name,phone_number,password,confirm_password) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
const validateLoginUser = "SELECT * FROM registration WHERE email_id = $1 AND password = $2";
const fetchBookingDetails = "select * from booking_details";
const saveBookingDetails = "INSERT INTO booking_details (name,date,time,status) VALUES($1, $2, $3, $4) RETURNING *";
const updateBookingDetails = "UPDATE booking_details SET status = $1 WHERE id =$2 RETURNING *"; 
module.exports = {
  getStudentsList,
  getStudentById,
  fetchLoginDetails,
  insertInLogin,
  saveRegistration,
  validateLoginUser,
  fetchBookingDetails,
  saveBookingDetails,
  updateBookingDetails,
};

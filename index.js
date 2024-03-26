const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 4001; // Choose your desired port

// Use body-parser middleware to parse JSON requests
app.use(express.json());
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ limit: "1000mb", extended: true }));
app.use(bodyParser.json());
const cors = require("cors");
const jwt = require("jsonwebtoken");
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
// Replace with your actual database connection details
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "Kir@n1998",
  port: 5432,
});

app.post("/api/login", async (req, res) => {
  try {
    console.log("inside the login");
    const { email, password } = req.body;
    console.log("email", email);
    console.log("password", password);

    // Check if the user exists in the database
    const userQuery = await pool.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);
    const user = userQuery.rows[0];

    if (!user) {
      // User does not exist
      res.status(404).json({
        status: false,
        message: "User not found.",
        code: 404,
      });
      return;
    }

    // Validate the password
    if (password !== user.password) {
      // Incorrect password
      res.status(401).json({
        status: false,
        message: "Incorrect password.",
      });
      return;
    }

    // User exists and password is correct
    // res.status(200).json({
    //   success: true,
    //   user: user,
    //   message: "User logged in successfully.",
    //   jwt_token:

    // });
    // Generate JWT token
    const token = jwt.sign(
      { ...user, password: "", confirmpassword: "", profilephoto: "" },
      "root"
    );

    // Convert token to base64
    // const base64Token = Buffer.from(token).toString("base64");
    // console.log("token", token)
    const base64Token = token;

    res.status(200).json({
      status: true,
      user: user,
      message: "User logged in successfully.",
      jwt_token: base64Token,
      roles: ["Shop Owner"],
    });

    // res.status(200).json({
    //   status: "success",
    //   roles: ["Admin", "User", "SystemAdmin"],
    //   message: "User logged in successfully.",
    //   code :200,
    //   jwt_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJBZG1pbiIsIlVzZXIiLCJTeXN0ZW1BZG1pbiJdLCJmdWxsX25hbWUiOiJLaXJhbiByYWoiLCJlbWFpbCI6ImtpcmFucmFqLmNoaW50YWRhQGVwc29mdGluYy5jb20iLCJ1c2VySWQiOjEsInJvbGUiOiJBZG1pbiIsInVzZXJfdHlwZSI6IlNob3BPd25lciJ9.whJduNoaqcM34DRELRFR3uoc5kW0Z8c5adRxek_DErI"

    // });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ success: false, message: "Error logging in user." });
  }
});
// Endpoint for user registration
app.post("/api/registerUser", async (req, res) => {
  try {
    console.log("inside the register user");

    const {
      profilePhoto,
      password,
      firstName,
      lastName,
      email,
      confirmPassword,
      userType,
      phoneNumber,
    } = req.body;

    // Validate input data if needed

    // Example query to insert user data into the Users table
    const result = await pool.query(
      "INSERT INTO Users (firstname,lastname,email,password,confirmpassword,phonenumber,profilephoto,usertype) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *",
      [
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phoneNumber,
        profilePhoto,
        userType,
      ]
    );

    const newUser = result.rows[0];
    console.log("User registered successfully.");
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res
      .status(500)
      .json({ success: false, message: "Error registering user." });
  }
});
app.post(
  "/api/save-barberApplication-data/:barberId/:shopId/:ownerId",
  async (req, res) => {
    try {
      console.log("save the barber application data");
      const { barberId, shopId, ownerId } = req.params;
      const { years, months, status, description } = req.body;
      const result = await pool.query(
        "INSERT INTO BarberApplications (shopid,ownerid,status,experience,description,years,months,barberid) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *",
        [
          shopId,
          ownerId,
          "pending",
          String(years) + "y " + String(months) + "m",
          description,
          years,
          months,
          barberId,
        ]
      );

      const newApplication = result.rows[0];
      console.log("Barber application submitted successfully.");
      res.status(201).json({
        success: true,
        code: 201,
        message: "Barber application submitted successfully.",
        data: newApplication,
      });
    } catch (error) {
      if (error.code === "23505") {
        // Duplicate key violation
        console.error("Duplicate key violation:", error.detail);
        res.status(400).json({
          success: false,
          message: "Oops.....! You have already applied for this job.",
          code: 400,
        });
      } else {
        console.error("Error during user registration:", error);
        res.status(500).json({
          success: false,
          message: "Error registering user due to " + error,
          code: 500,
        });
      }
    }
  }
);
//if the use is shop owner  after inserting into  the user tabel it will insert into the shop owner table here
app.post("/api/barber-shop-registration/:ownerId", async (req, res) => {
  console.log("inside the barber shop registration");
  console.log(req.body);

  try {
    const { ownerId } = req.params;

    const { location, shopName, profilePhoto } = req.body;

    // Example query to insert user data into the Users table
    const result = await pool.query(
      "INSERT INTO Shops (shopName, location,ownerid,profilephoto) VALUES ($1, $2, $3,$4) RETURNING *",
      [shopName, location, ownerId, profilePhoto]
    );

    const registeredShopData = result.rows[0];

    res.status(200).json({
      status: true,
      message: "Shop registered successfully.",
      data: registeredShopData,
      code: 200,
    });
  } catch (error) {
    console.error("Error during Shop registration:", error);
    res.status(500).json({
      success: false,
      message: "Error registering shop registration.",
    });
  }
});
app.get("/api/shop-name-availability/:shopName/:ownerId", async (req, res) => {
  console.log("inside the barber shop registration");
  console.log(req.body);

  try {
    const { shopName, ownerId } = req.params;
    console.log("shopName", shopName);
    console.log("ownerId", ownerId);
    // const result = await pool.query(`SELECT * FROM Shops WHERE shopName ='${shopName}' and  ownerid='${ownerId}'`);
    const result = await pool.query(
      `SELECT * FROM Shops WHERE shopName = '${shopName}' AND ownerid <> '${ownerId}'`
    );

    const shopsNames = result.rows;
    console.log("shopsNames", shopsNames);

    const isValuePresent = shopsNames.some((obj) => obj.shopname === shopName);
    console.log("isValuePresent", isValuePresent);
    if (isValuePresent) {
      res.status(201).json({
        success: true,
        message: "Shop name already exists.",
        shop: shopsNames,
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Shop name is available.",
        shop: shopsNames,
      });
    }
  } catch (error) {
    console.error("Error during Shop registration:", error);
    res.status(500).json({
      success: false,
      message: "Error registering shop registration.",
    });
  }
});
app.post("/api/saloon-booking/:userId/:shopId/:ownerId", async (req, res) => {
  console.log("inside the salon  booking");
  console.log(req.body);

  try {
    const { userId, shopId, ownerId } = req.params;
    const { shopName, location, datetime } = req.body;

    console.log("shopName", shopName);
    console.log("location", location);
    console.log("datetime", datetime);
    console.log("userId", userId);
    console.log("shopId", shopId);
    console.log("ownerId", ownerId);
    const result = await pool.query(
      "INSERT INTO Bookings (userid, location,shopname,barberid,bookingdatetime,status,shopid,ownerid) VALUES ($1, $2, $3,$4,$5,$6,$7,$8) RETURNING *",
      [userId, location, shopName, 0, datetime, "pending", shopId, ownerId]
    );

    const newAppointment = result.rows;

    res.status(200).json({
      status: true,
      code: 200,
      message:
        "Appointment Locked In! Your journey to beauty begins soon. See you at the salon!.",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Error during Shop registration:", error);
    res.status(500).json({
      success: false,
      message:
        "Error Oops! Something went wrong. Please try again later for appointment",
    });
  }
});

// app.get('/api/get-all-registerShopOwner', async (req, res) => {
//   try {

//     const result = await pool.query('SELECT * FROM ShopOwners');

//     const newUser = result.rows[0];
//     res.status(200).json({
//       success: true,
//       message: 'Fetched all-registerShopOwner successfully.',
//       shopOwners: allShopOwners,
//     });
//     res.status(201).json({ success: true, message: 'Fetched all-registerShopOwner successfully.', user: newUser });
//   } catch (error) {
//     console.error('Error during fetching all-registerShopOwner:', error);
//     res.status(500).json({ success: false, message: 'Error fetching all-registerShopOwner' });
//   }
// });

//api to get all the shops
app.get("/api/get-all-shops/:ownerId", async (req, res) => {
  const { ownerId } = req.params;
  try {
    console.log("inside the get all shops");
    const sqlQuery = `
    SELECT Shops.ShopID, Shops.ShopName, Shops.Location, Shops.ProfilePhoto, Users.FirstName, Users.LastName,Users.PhoneNumber,Users.Email
    FROM Shops
    JOIN Users ON Shops.OwnerID = Users.UserID
    where Shops.OwnerID = '${ownerId}'
  `;
    const result = await pool.query(sqlQuery);

    const shops = result.rows;

    res.status(200).json({
      success: true,
      message: "Fetched all shops successfully.",
      shops,
    });
  } catch (error) {
    console.error("Error during fetching all shops:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching all shops" });
  }
});
app.get("/api/get-salon-servicess", async (req, res) => {
  try {
    const sqlQuery = `
    SELECT  *
    FROM SalonServices
    ;
`;
    const result = await pool.query(sqlQuery);

    const data = result.rows;

    res.status(200).json({
      success: true,
      code: 200,
      message: "Fetched all salon servicess  successfully.",
      data,
    });
  } catch (error) {
    console.error("Error during fetching all  salon servicess:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching  salon servicess" });
  }
});
app.get("/api/shops-locations", async (req, res) => {
  try {
    console.log("inside the get all shops location");
    const sqlQuery = `
    SELECT DISTINCT Location
FROM Shops;
  `;

    const result = await pool.query(sqlQuery);

    const shopsLocations = result.rows;

    res.status(200).json({
      success: true,
      message: "Fetched all shops  location successfully.",
      shopsLocations,
    });
  } catch (error) {
    console.error("Error during fetching all shops:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching all shops locations" });
  }
});
app.get("/api/shopname-by-location/:location/", async (req, res) => {
  try {
    const { location } = req.params;

    console.log("inside the get all shops location");
    const sqlQuery = `
    SELECT shopid,shopname,location,ownerid
FROM Shops WHERE Location =  '${location}';`;
    const result = await pool.query(sqlQuery);

    const data = result.rows;

    res.status(200).json({
      success: true,
      message: "Fetched all shops  location successfully.",
      data,
    });
  } catch (error) {
    console.error("Error during fetching all shops:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching all shops locations" });
  }
});
//To get booking details along with user information
// app.get('/api/get-all-bookings', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT
//         B.BookingID,
//         B.UserID,
//         U.Username,
//         U.FirstName,
//         U.LastName,
//         U.Email,
//         B.BarberID,
//         B.BookingDateTime,
//         B.Status
//       FROM
//         Bookings B
//       JOIN
//         Users U ON B.UserID = U.UserID
//     `);

//     const bookings = result.rows;

//     res.status(200).json({
//       success: true,
//       message: 'Fetched all bookings successfully.',
//       bookings,
//     });
//   } catch (error) {
//     console.error('Error during fetching all bookings:', error);
//     res.status(500).json({ success: false, message: 'Error fetching all bookings' });
//   }
// });

app.get("/api/get-all-shop-owners", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        *
      FROM
        Users 
      WHERE UserType Like 'Shop Owner'
    `);

    const shopOwners = result.rows;

    res.status(200).json({
      success: true,
      message: "Fetched all shop owners successfully.",
      shopOwners,
    });
  } catch (error) {
    console.error("Error during fetching all shop owners:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching all shop owners" });
  }
});

app.get("/api/get-all-users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Users");
    const users = result.rows;

    res.status(200).json({
      success: true,
      message: "Fetched all users successfully.",
      users,
    });
    console.log("Fetched all users successfully.");
    console.log("users", users);
  } catch (error) {
    console.error("Error during fetching all users:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching all users" });
  }
});

//get all booking based on shop ownerid
app.get("/api/users-with-bookings/:ownerId", async (req, res) => {
  try {
    console.log("Fetching users with booked appointments");
    const { ownerId } = req.params;
    // Users.ProfilePhoto,
    const sqlQuery = `
      SELECT Users.UserID, Users.FirstName, Users.LastName, Users.Email, Users.PhoneNumber,Users.UserType,
             Bookings.BookingID, Bookings.Location, Bookings.ShopName, Bookings.BarberID, Bookings.ShopID, Bookings.OwnerID,
             Bookings.BookingDateTime, Bookings.Status
      FROM Users
      INNER JOIN Bookings ON Users.UserID = Bookings.UserID
      WHERE Bookings.OwnerID = ${ownerId} AND Bookings.Status = 'pending';
    `;

    const result = await pool.query(sqlQuery);
    const data = result.rows;

    res.status(200).json({
      success: true,
      message: "Fetched users with booked appointments successfully.",
      data,
    });
  } catch (error) {
    console.error(
      "Error during fetching users with booked appointments:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Error fetching users with booked appointments",
    });
  }
});
app.get("/api/get-locations", async (req, res) => {
  try {
    console.log("Fetching users with booked appointments");

    const sqlQuery = `
      SELECT *
      FROM Locations
    
    `;

    const result = await pool.query(sqlQuery);
    const data = result.rows;

    res.status(200).json({
      success: true,
      message: "Fetched   Locations  successfully.",
      data,
    });
  } catch (error) {
    console.error("Error during fetching Locations  successfully", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Locations  successfully",
    });
  }
});
app.get("/api/get-shops-by-location/:location", async (req, res) => {
  try {
    console.log("Fetching users with booked appointments");
    const { location } = req.params;
    const sqlQuery = `
    SELECT * FROM Shops WHERE Location = '${location}';

    `;

    const result = await pool.query(sqlQuery);
    const data = result.rows;

    res.status(200).json({
      success: true,
      message: "Fetched   Locations  successfully.",
      data,
    });
  } catch (error) {
    console.error("Error during fetching Locations  successfully", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Locations  successfully",
    });
  }
});
app.get(
  "/api/get-barbers-by-shoownerId/:ownerid/:status/:applicationId/:userType",
  async (req, res) => {
    try {
      console.log(
        "Fetching  barbers by shop owner  and status and application id"
      );
      const { ownerid, status, applicationId,userType } = req.params;
      let  sqlQuery ="";
if(userType === 'shopowner'){

   sqlQuery = `SELECT u.UserID AS BarberID, u.FirstName, u.LastName, u.Email, u.PhoneNumber, u.ProfilePhoto,ba.Status,ba.Experience,ba.Description,ba.applicationid
  FROM Users u
  JOIN BarberApplications ba ON u.UserID = ba.BarberID
  WHERE ba.OwnerID = ${ownerid} AND ba.Status ='${status}' and ba.applicationid ='${applicationId}';
  `;

}else{
  sqlQuery = `SELECT u.UserID AS BarberID, u.FirstName, u.LastName, u.Email, u.PhoneNumber, u.ProfilePhoto,ba.Status,ba.Experience,ba.Description,ba.applicationid
  FROM Users u
  JOIN BarberApplications ba ON u.UserID = ba.BarberID
  WHERE ba.BarberID = ${ownerid} and ba.applicationid ='${applicationId}';
  `;
}
     

      const result = await pool.query(sqlQuery);
      const data = result.rows;

      res.status(200).json({
        status: true,
        message: "Fetched barbers list successfully based on the owner id.",
        data,
        code: 200,
      });
    } catch (error) {
      console.error("Error during fetching barbersList  due to", error);
      res.status(500).json({
        status: false,
        message: "Error during fetching barbersList  due to  " + error,
        code: 500,
      });
    }
  }
);

  app.get("/api/barbers-list/:ownerid/:status/:userType", async (req, res) => {

  try {
    console.log("Fetching  barbers by shop owner id or by barber id");
  
    const { ownerid, status ,userType} = req.params;
    console.log(userType)


    console.log("ownerid",ownerid)
    console.log("status",status)
    console.log("userType",userType)

    let sqlQuery ="";

    if(userType === 'shopowner'){
      sqlQuery = `SELECT u.UserID AS BarberID, u.FirstName, u.LastName, u.Email, u.PhoneNumber, u.ProfilePhoto,ba.Status,ba.Experience,ba.Description,ba.applicationid
    FROM Users u
    JOIN BarberApplications ba ON u.UserID = ba.BarberID
    WHERE ba.OwnerID = ${ownerid} AND ba.Status ='${status}';
    `;
    }else if(userType === "Barber"){
      sqlQuery = `SELECT u.UserID AS BarberID, u.FirstName, u.LastName, u.Email, u.PhoneNumber, u.ProfilePhoto,ba.Status,ba.Experience,ba.Description,ba.applicationid
    FROM Users u
    JOIN BarberApplications ba ON u.UserID = ba.BarberID
    WHERE ba.BarberID = ${ownerid};
    `;
    }
     
    // const sqlQuery2 = `SELECT u.UserID AS BarberID, u.FirstName, u.LastName, u.Email, u.PhoneNumber, u.ProfilePhoto,ba.Status,ba.Experience,ba.Description,ba.applicationid
    // FROM Users u
    // JOIN BarberApplications ba ON u.UserID = ba.BarberID
    // WHERE ba.OwnerID = ${ownerid} AND ba.Status ='${status}' and ba.applicationid =='${status}';
    // `;

    const result = await pool.query(sqlQuery);
    const data = result.rows;

    res.status(200).json({
      status: true,
      message: `Fetched barbers list successfully based on the ${userType} id`,
      data,
      code: 200,
    });
  } catch (error) {
    console.error("Error during fetching barbersList  due to", error);
    res.status(500).json({
      status: false,
      message: `Error during fetching barbersList  due to   + ${error}`,
      code: 500,
    });
  }
});
app.put("/api/update-shop/:shopId", async (req, res) => {
  try {
    console.log("Update Shop details");
    const { shopId } = req.params;
    const { profilePhoto, phoneNumber, location } = req.body;

    const sqlQuery = `UPDATE Shops SET profilephoto = '${profilePhoto}', location = '${location}' WHERE ShopID = '${shopId}'`;

    const quarry2 = `UPDATE Users SET phonenumber = '${phoneNumber}' WHERE userid = (SELECT ownerid FROM Shops WHERE shopid = '${shopId}')`;
    const result = await pool.query(sqlQuery);
    const result2 = await pool.query(quarry2);

    res.status(200).json({
      status: true,
      message: "Shop data updated successfully.",

      code: 200,
    });
  } catch (error) {
    console.error("Failed to update shop data due to ", error);
    res.status(500).json({
      status: false,
      message: "Failed to update  shop data due to  " + error,
      code: 500,
    });
  }
});
app.get("/api/get-users-appointments/:userId", async (req, res) => {
  try {
    console.log("inside individual user appointments");
    const { userId } = req.params;

    const sqlQuery = `SELECT * FROM Bookings WHERE UserID = '${userId}'`;

    const result = await pool.query(sqlQuery);
    const data = result.rows;
    res.status(200).json({
      status: true,
      data,
      message: "Fetched user appointments successfully.",
      code: 200,
    });
  } catch (error) {
    console.error("Failed  to fetch user appointments due to ", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch user appointments " + error,
      code: 500,
    });
  }
});
app.get("/api/delete-barber-application/:applicationid", async (req, res) => {
  try {
    console.log("inside delete barber  application");
    const { applicationid } = req.params;

    const sqlQuery = `DELETE  FROM barberapplications WHERE applicationid = '${applicationid}'`;

    const result = await pool.query(sqlQuery);
    const data = result.rows;
    res.status(200).json({
      status: true,
      data,
      message: "Deleted application successfully.",
      code: 200,
    });
  } catch (error) {
    console.error("Failed  to delete user appointments due to ", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch user appointments " + error,
      code: 500,
    });
  }
});
app.put(
  "/api/update-barber-application-status/:applicationId/:status",
  async (req, res) => {
    try {
      console.log("inside update appointment");
      const { applicationId, status } = req.params;

      const sqlQuery = `UPDATE BarberApplications SET status = '${status}' WHERE applicationid = '${applicationId}'`;

      const result = await pool.query(sqlQuery);
      const data = result.rows[0];
      res.status(200).json({
        status: true,
        data,
        message: "Application Updated successfully successfully.",
        code: 200,
      });
    } catch (error) {
      console.error("Failed  to update application  status due to  ", error);
      res.status(500).json({
        status: false,
        message: "Failed to update the application status due to " + error,
        code: 500,
      });
    }
  }
);
app.delete("/api/delete-shop/:shopId", async (req, res) => {
  try {
    console.log("inside  the delete shop");
    const { shopId } = req.params;

    const sqlQuery = `DELETE  FROM Shops WHERE shopid = '${shopId}'`;
    const result = await pool.query(sqlQuery);
    const data = result.rows[0];
    res.status(200).json({
      status: true,
      data,
      message: "Shop deleted successfully.",
      code: 200,
    });
  } catch (error) {
    console.error("Failed  to delete shop  status due to  ", error);
    // Check if the error is due to foreign key constraint violation
    if (error.constraint === "barberapplications_shopid_fkey") {
      res.status(400).json({
        message:
          "If there are no appointments and no pending applications associated with your shop, you can proceed to delete it. Until then, we cannot proceed with the deletion of your shop.",
        status: false,
        code: 400,
      });
    } else
      res.status(500).json({
        status: false,
        message: "Failed to delete  the shop   due to " + error,
        code: 500,
      });
  }
});

app.put("/api/update-user-profile-photo/:userId",async(req,res)=>{
  try {
    console.log("inside  Update user  profile photo");
    const { userId } = req.params;

    const sqlQuery = `UPDATE Users SET ProfilePhoto = '${req.body.profilePhoto}' WHERE UserID = '${userId}'`;

    const result = await pool.query(sqlQuery);
    const data = result.rows[0];
    console.log(data);
    console.log("User profile photo updated successfully.")
    res.status(200).json({
      status: true,
      data,
      message: "Updated user profile photo successfully.",
      code: 200,
    });
  } catch (error) {
    console.error("Failed  Update user  profile photo due to  ", error);
    res.status(500).json({
      status: false,
      message: "Failed to Update user profile photo due to " + error,
      code: 500,
    });
  }
})
app.get("/api/get-user-profile-photo/:userId",async(req,res)=>{
  try {
    console.log("inside  the get user profile photo");
    const { userId } = req.params;

    const sqlQuery = `SELECT ProfilePhoto FROM Users WHERE UserID = '${userId}'`;

    const result = await pool.query(sqlQuery);
    const data = result.rows[0];
    res.status(200).json({
      status: true,
      data,
      message: "Fetched user profile photo successfully.",
      code: 200,
    });
  } catch (error) {
    console.error("Failed  to fetch user profile photo due to  ", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch user profile photo due to " + error,
      code: 500,
    });
  }
})



// app.post('/api/barber-shop-registration', async (req, res) => {
//   try {
// console.log("inside the barber shop registration");
//     const { shopName,location ,ownerId} = req.body;
//     const result = await pool.query(
//       'INSERT INTO Shops (shopname,location,ownerid) VALUES ($1, $2, $3) RETURNING *',
//       [shopName, location, ownerId]
//     );

//     const shopRegistrationData = result.rows[0];
//     res.status(201).json({ success: true, message: 'Shop registered successfully.', shop: shopRegistrationData });
//   } catch (error) {
//     console.error('Error during shop  registration:', error);
//     res.status(500).json({ success: false, message: 'Error shop registration' });
//   }
// });

// app.post('/api/barber-registration', async (req, res) => {
//   try {
//     console.log("Inside the barber registration");

//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       phoneNumber,
//       profilePhoto,
//       experience,
//       description
//     } = req.body;

//     const result = await pool.query(
//       'INSERT INTO Barbers (FirstName, LastName, Email, Password, PhoneNumber, ProfilePhoto, Experience, Description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
//       [firstName, lastName, email, password, phoneNumber, profilePhoto, experience, description]
//     );

//     const barberRegistrationData = result.rows[0];
//     res.status(201).json({ success: true, message: 'Barber registered successfully.', barber: barberRegistrationData });
//   } catch (error) {
//     if (error.code === '23505' && error.constraint === 'barbers_email_key') {
//       // Unique constraint violation on email field
//       res.status(400).json({ success: false, message: 'Email address is already registered.' });
//     } else {
//       console.error('Error during barber registration:', error);
//       res.status(500).json({ success: false, message: 'Error barber registration' });
//     }
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(
    `Server is now running on port ${port}. Ready to handle incoming requests.`
  );
});

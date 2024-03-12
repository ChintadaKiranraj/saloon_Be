const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 4001; // Choose your desired port

// Use body-parser middleware to parse JSON requests
app.use(express.json());
app.use(bodyParser.json());
const cors = require("cors");
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
          errorCode: 400,
        });
      } else {
        console.error("Error during user registration:", error);
        res
          .status(500)
          .json({ success: false, message: "Error registering user." });
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

    const { location, shopName } = req.body;

    // Validate input data if needed

    // Example query to insert user data into the Users table
    const result = await pool.query(
      "INSERT INTO Shops (shopName, location,ownerid) VALUES ($1, $2, $3) RETURNING *",
      [shopName, location, ownerId]
    );

    const registeredShopData = result.rows[0];

    res.status(201).json({
      success: true,
      message: "Shop registered successfully.",
      data: registeredShopData,
      code: 201,
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
  console.log("inside the barber shop registration");
  console.log(req.body);

  try {
    const { userId, shopId, ownerId } = req.params;
    const { shopName, location, datetime } = req.body;
    console.log("ownerId", ownerId);
    const result = await pool.query(
      "INSERT INTO Bookings (userid, location,shopname,barberid,bookingdatetime,status,shopid,ownerid) VALUES ($1, $2, $3,$4,$5,$6,$7,$8) RETURNING *",
      [userId, location, shopName, 0, datetime, "pending", shopId, ownerId]
    );

    const newAppointment = result.rows;

    res.status(201).json({
      success: true,
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
app.get("/api/get-all-shops", async (req, res) => {
  try {
    console.log("inside the get all shops");
    const sqlQuery = `
    SELECT Shops.ShopID, Shops.ShopName, Shops.Location, Shops.ProfilePhoto, Users.FirstName, Users.LastName,Users.PhoneNumber,Users.Email
    FROM Shops
    JOIN Users ON Shops.OwnerID = Users.UserID
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
    LIMIT 6;
`;
    const result = await pool.query(sqlQuery);

    const data = result.rows;

    res.status(200).json({
      success: true,
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
    SELECT *
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
app.get("/api/users-with-bookings", async (req, res) => {
  try {
    console.log("Fetching users with booked appointments");

    const sqlQuery = `
      SELECT Users.UserID, Users.FirstName, Users.LastName, Users.Email, Users.PhoneNumber, Users.ProfilePhoto, Users.UserType,
             Bookings.BookingID, Bookings.Location, Bookings.ShopName, Bookings.BarberID, Bookings.ShopID, Bookings.OwnerID,
             Bookings.BookingDateTime, Bookings.Status
      FROM Users
      INNER JOIN Bookings ON Users.UserID = Bookings.UserID;
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

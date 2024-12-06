const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authorizeRoleWithApiKey=require("./middleware/authorizeRole");
const authMiddleware=require("./middleware/authMiddleware")
const dotenv = require("dotenv");
const { Client } = require("pg");


dotenv.config();
const app = express();
app.use(express.json());

console.log(process.env.POSTGRES_CONNECTION_URI)
const pgClient=new Client(process.env.POSTGRES_CONNECTION_URI);

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ADMIN_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;


pgClient.connect();
  pgClient.query('SELECT * FROM USERS;').then((res)=>{
    console.log(res.rows)
  }).catch((err)=>{
    console.log(err)
  })

//register user
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pgClient.query(
      `INSERT INTO users (username, password, role) VALUES ('${username}', '${hashedPassword}','${role}')`
    );
    res.status(201).json({ message: "You have signed up", user: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Username already exists" });
    }
    res.status(500).json({ error: "User registration failed", details: err.message });
  }
});


//login user
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await pgClient.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = userResult.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Login failed" ,details:err.message});
    }
});

//add a new train
app.post("/admin/addtrain", authMiddleware, authorizeRoleWithApiKey("admin"), async (req, res) => {
    const { name, source, destination, total_seats } = req.body;
  
    try {
      const result = await pgClient.query(
        "INSERT INTO trains (name, source, destination, total_seats, available_seats) VALUES ($1, $2, $3, $4, $4) RETURNING *",
        [name, source, destination, total_seats]
      );
      res.status(201).json({ message: "Train added successfully", train: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: "Failed to add train", details: err.message });
    }
  });
  

//get seat availabity
app.get("/trains", async (req, res) => {
    const { source, destination } = req.body;
    try {
        const result = await pgClient.query(
            "SELECT * FROM trains WHERE source = $1 AND destination = $2",
            [source, destination]
        );

        res.json({ trains: result.rows });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch trains" ,details:err.message});
    }
});


//book a seat
app.post("/book",authMiddleware, async (req, res) => {
    const { trainId, seatCount } = req.body;
    userId=req.user.id;
    try {
    
        const trainResult = await pgClient.query("SELECT * FROM trains WHERE id = $1", [trainId]);
        const train = trainResult.rows[0];

        if (!train || train.available_seats < seatCount) {
            return res.status(400).json({ error: "Insufficient seats available" });
        }

        await pgClient.query("UPDATE trains SET available_seats = available_seats - $1 WHERE id = $2", [
            seatCount,
            trainId,
        ]);

        const bookingResult = await pgClient.query(
            "INSERT INTO bookings (user_id, train_id, seat_count) VALUES ($1, $2, $3) RETURNING *",
            [userId, trainId, seatCount]
        );

        res.status(201).json({ booking: bookingResult.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Booking failed",details:err.message });
    }
});

//get specific booking details
app.get("/booking/:id",authMiddleware, async (req, res) => {
    
    const { id } = req.params;
    userId=req.user.id;
    try {
        const result = await pgClient.query("SELECT * FROM bookings WHERE id = $1 AND user_id = $2", [
            id,
            userId,
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.json({ booking: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch booking details",details:err.message });
    }
});




app.listen(3000,()=>{
console.log("server is up and running on port 3000")
})
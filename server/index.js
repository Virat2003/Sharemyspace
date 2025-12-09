const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const userRoutes = require("./routes/user.js")

const authRoutes = require("./routes/auth.js")
const ListingRoutes= require("./routes/listing.js")
const BookingRoutes = require("./routes/booking.js")
const AdminRoutes = require("./routes/admin.js")

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/bookings",BookingRoutes)
app.use("/users", userRoutes)
app.use("/admin", AdminRoutes)

/* ROUTES */
app.use("/auth", authRoutes)
app.use("/properties",ListingRoutes)

/* MONGOOSE SETUP */
const PORT = 3001;
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "shareMyspace",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));

  
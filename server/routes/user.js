const router = require("express").Router()

const Booking = require("../models/Booking")
const Listing = require("../models/Listing")

/* to get booking list */
router.get("/:userId/bookings", async (req, res) => {
  try {
    const { userId } = req.params
    const bookings = await Booking.find({ customerId: userId }).populate("customerId hostId listingId")
    res.status(202).json(bookings)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Cannot find bookings!", error: err.message })
  }
})


/* to get Space list */
router.get("/:userId/properties", async (req, res) => {
  try {
    const { userId } = req.params
    const properties = await Listing.find({ creator: userId }).populate("creator")
    res.status(202).json(properties)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Cannot find properties!", error: err.message })
  }
})


module.exports = router
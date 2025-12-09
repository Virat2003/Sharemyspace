const router = require("express").Router()

const Booking = require("../models/Booking")

/* create booking */
router.post("/create", async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body
    const newBooking = new Booking({ customerId, hostId, listingId, startDate, endDate, totalPrice })
    await newBooking.save()
    res.status(200).json(newBooking)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to create a new Booking!", error: err.message })
  }
})


/* get bookings for an owner (host) */
router.get("/owner/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params
    const bookings = await Booking.find({ hostId: ownerId }).populate("customerId hostId listingId")
    res.status(200).json(bookings)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Cannot find bookings for owner!", error: err.message })
  }
})

/* update booking status (confirm / reject) */
router.patch("/:bookingId/status", async (req, res) => {
  try {
    const { bookingId } = req.params
    const { status } = req.body
    if (!["pending", "confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }
    const updated = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true }).populate(
      "customerId hostId listingId"
    )
    res.status(200).json(updated)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to update booking status", error: err.message })
  }
})

module.exports = router
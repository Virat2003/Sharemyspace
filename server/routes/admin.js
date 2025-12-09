const router = require('express').Router();
// admin panel added
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');

/* Admin dashboard stats */
router.get('/dashboard', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSpaces = await Listing.countDocuments();
    const totalBookings = await Booking.countDocuments();
    res.status(200).json({ totalUsers, totalSpaces, totalBookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: err.message });
  }
});

/* Users management */
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password -otp -resetOtp');
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

router.delete('/users/:userId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

/* Spaces management */
router.get('/spaces', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const spaces = await Listing.find().populate('creator');
    res.status(200).json(spaces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch spaces', error: err.message });
  }
});

router.patch('/spaces/:spaceId/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { spaceId } = req.params;
    const { status } = req.body; // expected approved/rejected/pending
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const updated = await Listing.findByIdAndUpdate(spaceId, { status }, { new: true }).populate('creator');
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update space status', error: err.message });
  }
});

router.delete('/spaces/:spaceId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { spaceId } = req.params;
    await Listing.findByIdAndDelete(spaceId);
    res.status(200).json({ message: 'Space removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove space', error: err.message });
  }
});

/* Bookings management */
router.get('/bookings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('customerId hostId listingId');
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
});

router.patch('/bookings/:bookingId/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body; // pending/confirmed/rejected
    if (!['pending', 'confirmed', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const updated = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true }).populate('customerId hostId listingId');
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update booking status', error: err.message });
  }
});

module.exports = router;

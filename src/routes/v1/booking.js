const {BookingController} = require('../../controllers');
const express = require('express');
const {validateBookingData, validatePaymentData} = require('../../middlewares');

const router = express.Router();

router.post('/',
    // Middleware to validate request body
    validateBookingData,
     BookingController.createBooking);

router.post('/payments', 
    // Middleware to validate request body
    validatePaymentData
    ,BookingController.makePayment);

module.exports = router;
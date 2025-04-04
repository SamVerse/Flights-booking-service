
// creating a middleware for create booking
async function validateBookingData(req, res, next) {
    const { flightId, userId, noOfSeats } = req.body;
    if (!flightId || !userId || !noOfSeats) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if ( noOfSeats <= 0) {
        return res.status(400).json({ error: 'Invalid number of seats' });
    }
    next();
}

// creating a middleware for make payment
async function validatePaymentData(req, res, next) {
    const { bookingId, userId, totalCost } = req.body;
    if (!bookingId || !userId || !totalCost) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (totalCost <= 0) {
        return res.status(400).json({ error: 'Invalid payment amount' });
    }
    next();
}

module.exports = {
    validateBookingData,
    validatePaymentData,
};
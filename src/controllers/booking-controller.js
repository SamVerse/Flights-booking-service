const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services');
const { ErrorResponse, SuccessResponse } = require('../utils/common');

const inMemoryDB = {}; // In-memory database for demonstration purposes

async function createBooking(req, res) {
    try {
        const response = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats,
        });
        SuccessResponse.data = response; 
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode)
            .json(ErrorResponse);
    }
}

async function makePayment(req, res) {
    try {
        // Check if the idempotency key is provided in the request headers
        // Make a idempotent API call to process the payment
        const idempotencyKey = req.headers['x-idempotency-key'];
        if (!idempotencyKey) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Idempotency key is required',
            });
        }
        if (inMemoryDB[idempotencyKey]) {
            return res.status(StatusCodes.OK).json({
                message: 'Payment already processed',
                data: inMemoryDB[idempotencyKey],
            });
        }
        // Simulate payment processing and store the result in the in-memory database

        const response = await BookingService.makePayment({
            bookingId: req.body.bookingId,
            userId: req.body.userId,
            totalCost: req.body.totalCost,
        })
        inMemoryDB[idempotencyKey] = idempotencyKey; // Store the payment result using the idempotency key
        SuccessResponse.data = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode)
            .json(ErrorResponse);
    }
}

module.exports = {
    createBooking,
    makePayment,
}
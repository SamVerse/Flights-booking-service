const axios = require("axios");

const { BookingRepository } = require("../repositories");
const db = require("../models");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { ServerConfig } = require("../config/index");

const {Enums} = require('../utils/common')
const {CONFIRMED, PENDING, INITIATED, CANCELLED} = Enums.BOOKING_STATUS

const bookingRepository = new BookingRepository();

async function createBooking(bookingData) {
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(
        `${ServerConfig.FLIGHT_SERVICE_API_URL}/api/v1/flights/${bookingData.flightId}`
        );
        console.log(flight.data);
        const flightData = flight.data.data;

        // error handling for flight data
        if (!flight) {
        throw new AppError("Flight not found", StatusCodes.NOT_FOUND);
        }
        if (flightData.totalSeats < bookingData.noOfSeats) {
        throw new AppError("Not enough seats available", StatusCodes.BAD_REQUEST);
        }

        // calculate the total price
        const totalBillingAmount = flightData.price*bookingData.noOfSeats;
        const bookingPayload = { ...bookingData, totalCost: totalBillingAmount }

        // create booking
        const booking = await bookingRepository.create(bookingPayload, {transaction} );

        // update flight data
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE_API_URL}/api/v1/flights/${bookingData.flightId}/seats`, {
            seats: bookingData.noOfSeats,
            // transaction: transaction,
        });

        //set the status of the booking to pending as the initial status was initiated
        await bookingRepository.update(booking.id, {status: PENDING}, transaction);
        
        await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        console.error("Error creating booking:", error);
        throw error;
    }
}   


async function makePayment(paymentData){
    const transaction = await db.sequelize.transaction();
    try {
        // Here you would typically call a payment gateway API to process the payment
        // For this example, we'll simulate a successful payment response
        const bookingDetails = await bookingRepository.get(paymentData.bookingId, transaction);
        
        // Convert both values to numbers before comparing
        if(Number(bookingDetails.totalCost) !== Number(paymentData.totalCost)) {
            throw new AppError("Payment amount does not match booking cost", StatusCodes.BAD_REQUEST);
        }
        
        if(Number(bookingDetails.userId) !== Number(paymentData.userId)) {
            throw new AppError("User ID does not match booking user", StatusCodes.BAD_REQUEST);
        }

        // Check if the booking is already confirmed or cancelled
        if (bookingDetails.status === CONFIRMED) {
            throw new AppError("Booking already confirmed", StatusCodes.BAD_REQUEST);
        } else if (bookingDetails.status === CANCELLED) {
            throw new AppError("Booking already expired", StatusCodes.BAD_REQUEST);
        }

        //Now we want that if the user doesm't complete the payment in 5 minutes, the booking should be cancelled
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        const timeDifference = currentTime - bookingTime; // in milliseconds

        const timeDifferenceInMinutes = timeDifference / 1000 / 60; // convert to minutes
        console.log("Time difference in minutes:", timeDifferenceInMinutes);

        if (timeDifferenceInMinutes > 5) {
            // Cancel the booking if it exceeds 5 minutes
            await cancelBoooking(paymentData.bookingId);
            await transaction.commit();
            return { message: "Booking cancelled due to timeout" };
        }

        
        // Simulate payment processing
        // We assume payment is successful and update the booking status
        const response = await bookingRepository.update(paymentData.bookingId, {status: CONFIRMED}, transaction);
        await transaction.commit();
        return response;
    } catch (error) {
        await transaction.rollback();
        console.error("Error processing payment:", error);
        throw error;
    }
}

async function cancelBoooking(bookingId){
    try {
        const transaction = await db.sequelize.transaction();
        const bookingDetails = await bookingRepository.get(bookingId, transaction);
        // Check if the booking is already cancelled
        if (bookingDetails.status === CANCELLED) {
            await transaction.commit();
            return { message: "Booking already cancelled" };
        }

        // Update the seats in the flight
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE_API_URL}/api/v1/flights/${bookingDetails.flightId}/seats`, {
            seats: bookingDetails.noOfSeats,
            dec: 0,
            // transaction: transaction,
        });
        // Update the booking status to cancelled
        await bookingRepository.update(bookingId, {status: CANCELLED}, transaction);
        await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    createBooking,
    // Other booking-related functions can be added here
    makePayment,
    cancelBoooking
};

const { StatusCodes } = require('http-status-codes');

const {Booking} = require('../models');
const CrudRepository = require('./crud-repository');
const AppError = require('../utils/errors/app-error');
const { Op } = require('sequelize');


const {Enums} = require('../utils/common')
const {PENDING, INITIATED, CANCELLED} = Enums.BOOKING_STATUS

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }

    // Overriding the create method to add custom logic
    // for creating a booking
    async createBooking(data, transaction){
        const response = await Booking.create(data, {transaction});
        return response;
    }

    // Overriding the get method to add custom logic
    // for getting a booking by ID
    async get(data, transaction) {
        const response = await Booking.findByPk(data, {transaction});
        if (!response) {
            throw new AppError('Booking not found', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    // Overriding the update method to add custom logic
    // for updating a booking
    async update(id, data, transaction) {
        const response = await Booking.update(data, {
          where: { id },
          transaction // This should be inside the options object
        });
        return response;
      }

    async cancelOldBookings(timestamp) {
        const response = await Booking.update(
            // only want to update the status of the booking whose status is pending or initiated
            { status: CANCELLED },
            {
                where: {
                    [Op.and]: [
                        {   
                            status: {   
                                    [Op.or]: [
                                        { [Op.eq]: PENDING },
                                        { [Op.eq]: INITIATED }
                                    ]
                            }
                         },
                        { 
                            createdAt: {
                                 [Op.lt]: timestamp 
                            } 
                        }
                    ]
                }
            }
        );
        return response;
    }

}

module.exports = BookingRepository;



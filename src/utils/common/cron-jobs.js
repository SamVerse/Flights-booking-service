const cron = require('node-cron');
const { BookingService } = require('../../services');
function cronService() {
    cron.schedule('0 */15 * * * *', async () => {
        try {
            // Only require BookingService inside the scheduled function
            const response = await BookingService.cancelOldBookings();
            console.log("Cron job executed successfully:", response);
        } catch (error) {
            console.error("Error in cron job:", error);
        }
    });
    
    console.log("Cron job scheduled for checking expired bookings");
}

module.exports = cronService;
const express = require('express');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const CronService = require('./utils/common/cron-jobs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    // Start the cron jobs
    CronService();
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});

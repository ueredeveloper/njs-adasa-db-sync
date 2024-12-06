const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { insertOrUpdateSubterraneaManualService, insertOrUpdateSubterraneaTubularService } = require('./services');
const insertOrUpdateSuperficialSyncService = require('./services/insert-or-update-superfical-sync-service');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/services', insertOrUpdateSubterraneaManualService);
app.use('/services', insertOrUpdateSubterraneaTubularService);
app.use('/services', insertOrUpdateSuperficialSyncService);

app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
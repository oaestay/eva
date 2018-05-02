const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const botModule = require('./bot')(functions, admin);

exports.evaBot = functions.https.onRequest((req, res) => {
  return botModule.index(req, res);
});

const trackerModule = require('./tracker')(functions, admin);

exports.setUserLocation = functions.https.onRequest((req, res) => {
  return trackerModule.setUserLocation(req, res);
});

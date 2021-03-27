/////////////// Dependencies /////////////
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const mongoose = require('mongoose');
// session dependency here
const mongoURI = process.env.DB_URI;
const db = mongoose.connection;

/////////////// Connect to mongoose /////////////
mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
	console.log('MongoDB connection established:', mongoURI);
});

/////////////// Error / Disconnection /////////////
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('disconnected', () => console.log('mongo disconnected'));

/////////////// Middleware /////////////
app.use(express.urlencoded({ extended: false })); // extended: false - does not allow nested objects in query strings
app.use(express.json()); // returns middleware that only parses JSON
app.use(express.static('public'));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.header('Access-Control-Allow-Methods', '*');
	next();
});

/////////////// Controllers /////////////
app.get('/', (req, res) => {
	res.send('Hello World Carpark backend');
});

const carparkController = require('./controllers/carpark');
app.use('/carpark', carparkController);

//////////////////////////////////////////////////
app.listen(port, () => console.log('Listening at port', port + ' ' + mongoURI));

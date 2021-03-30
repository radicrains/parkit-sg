/////////////// Dependencies /////////////
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
// session dependency here
const mongoURI = process.env.DB_URI || 'mongodb://localhost:27017/carpark';
const db = mongoose.connection;
const request = require('request');

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
/////////////////////////////////////////

const proxyHelper = (url, req, res) => {
	request(
		{
			url: url,
			headers: {
				'AccessKey': '3fe311cb-5e09-42cc-b91f-49469ced4d67',
			},
		},
		(error, response, body) => {
			if (error || response.statusCode !== 200) {
				return res
					.status(500)
					.json({ type: 'error', message: error.message });
			}
			//JSON.parse() to convert body from JSON format to javaScript Object
			res.send(JSON.parse(body).Result)
		}
	);
}


app.get('/carparkToken', (req, res) => {
	proxyHelper('https://www.ura.gov.sg/uraDataService/insertNewToken.action', req, res)
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const tokenController = require('./controllers/token');
app.use('/token', tokenController);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/carparkAvailability', (req, res) => {
	request(
		{
			url:
				'https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability',
			headers: {
				// 'Content-Type': 'application/json',
				'AccessKey': '3fe311cb-5e09-42cc-b91f-49469ced4d67',
				'Token':
					'WdzpPsAe9bv9eg+ndDbgH99hjZvJVcs91e-ek1RAGy-N4-HUPr13Uja60ed1uzQu4nee3134rS9Ss91Tc4de049s7c3Tb389f1Tt',
			},
		},
		(error, response, body) => {
			if (error || response.statusCode !== 200) {
				return res
					.status(500)
					.json({ type: 'error', message: error.message });
			}
			// res.json(body);
			res.send(body)
		}
	);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/carparkListDetails', (req, res) => {
	request(
		{
			url:
				'https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details',
			headers: {
				// 'Content-Type': 'application/json',
				'AccessKey': '3fe311cb-5e09-42cc-b91f-49469ced4d67',
				'Token':
					'Me-s4-23B+pSbts2X4-HebB1-@4k9+2dUS99DKhEPuGfpt@BtED9e-6rgt7@4Q9edpc63-NbjnVs2D513y6497E9bnf49991DbF-',
			},
		},
		(error, response, body) => {
			if (error || response.statusCode !== 200) {
				return res
					.status(500)
					.json({ type: 'error', message: error.message });
			}
			// res.json(body);
			res.send(body)
		}
	);
});




const carparkController = require('./controllers/carpark');
app.use('/carpark', carparkController);

//////////////////////////////////////////////////
app.listen(port, () => console.log('Listening at port', port + ' ' + mongoURI));

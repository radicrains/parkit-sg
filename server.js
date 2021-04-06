/////////////// Dependencies /////////////
require('dotenv').config();
const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const session = require('express-session');
const mongoURI = process.env.DB_URI || 'mongodb://localhost:27017/carpark';
const db = mongoose.connection;
const request = require('request');
const Carparks = require('./models/carparks')
const moment = require('moment');

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
app.use(cors({
	origin: ['https://calvan-carpark.herokuapp.com/', 'https://calvan-carpark.herokuapp.com/sessions', 'https://calvan-carpark.herokuapp.com/carparkdetails' ],
	credentials: true
}));
// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header(
// 		'Access-Control-Allow-Headers',
// 		'Origin, X-Requested-With, Content-Type, Accept'
// 	);
// 	res.header('Access-Control-Allow-Methods', '*');
// 	next();
// });
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

/////////////// Controllers /////////////
app.get('/', (req, res) => {
	res.send('Hello World Carpark backend');
});

const userController = require('./controllers/users');
app.use('/users', userController);

const sessionController = require('./controllers/sessions');
app.use('/sessions', sessionController);

const carparkController = require('./controllers/carpark');
app.use('/carpark', carparkController);

const commentController = require('./controllers/comments');
const { json } = require('express');
app.use('/comments', commentController);
/////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/carparkdetails', (req, res) => {
	console.log('log req.session:', req.session.currentUser);
	let q = {}
	if(req.query.area) {
		q = {address: { $regex: req.query.area, $options: 'i' }}
	}
	// req.session.currentUser = req.query.currentUser;
	if(req.session.currentUser) {
		Carparks.find(q, (err, foundCarpark) => {
			if (err) console.log(err);
			if (foundCarpark) {
				// console.log(foundCarpark);
				res.json(foundCarpark);
			}
		});
		console.log('there is existing session');
	} else {
		res.json('')
		console.log('no session exist, please log in');
		console.log(req.session)
	}
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/carparkavailability', (req, res) => {
	request(
		{
			url:
				'https://api.data.gov.sg/v1/transport/carpark-availability?date_time=' + moment().subtract(2, 'minutes').format('YYYY-MM-DDThh:mm:ss'),
		},
		(error, response, body) => {
			if (error || response.statusCode !== 200) {
				console.log(error)
			}
			// res.json(body);
			res.send(body)
			console.log(moment().subtract(1, 'minutes').format('YYYY-MM-DDThh:mm:ss'))
		}
	)
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/coordinate', (req, res) => {
	const x = req.query.X;
	const y =req.query.Y;
	request(
		{
			url:
				`https://developers.onemap.sg/commonapi/convert/3414to3857?X=${x}&Y=${y}`,
		},
		(error, response, body) => {
			if (error || response.statusCode !== 200) {
				console.log(error)
			}
			console.log(JSON.parse(body))
			const convertedx = JSON.parse(body).X
			const convertedy = JSON.parse(body).Y
			console.log(`this is x: ${convertedx} and this is y: ${convertedy}`);

			request(
				{
					url:
						`https://developers.onemap.sg/commonapi/convert/3857to4326?X=${convertedx}&Y=${convertedy}`,
				},
				(error, response, body) => {
					if (error || response.statusCode !== 200) {
						console.log(error)
					}
					console.log(JSON.parse(body))
					const lat = JSON.parse(body).latitude
					const lng = JSON.parse(body).longitude
					console.log(`this is lat: ${lat} and this is lng: ${lng}`);
					res.send(body);
				}
			)
			
		}
	)
	
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// app.get('/commentsarea')


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////
app.listen(port, () => console.log('Listening at port', port + ' ' + mongoURI));












//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// const proxyHelper = (url, req, res) => {
// 	request(
// 		{
// 			url: url,
// 			headers: {
// 				'AccessKey': '3fe311cb-5e09-42cc-b91f-49469ced4d67',
// 			},
// 		},
// 		(error, response, body) => {
// 			if (error || response.statusCode !== 200) {
// 				return res
// 					.status(500)
// 					.json({ type: 'error', message: error.message });
// 			}
// 			//JSON.parse() to convert body from JSON format to javaScript Object
// 			res.send(JSON.parse(body))
// 		}
// 	);
// }


// app.get('/carparkToken', (req, res) => {
// 	proxyHelper('https://www.ura.gov.sg/uraDataService/insertNewToken.action', req, res)
// });


// app.get('/seedCarparkDetails', (req, res) => {
// 	request(
// 		{
// 			url:
// 				'https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&limit=2157',
// 		},
// 		(error, response, body) => {
// 			if (error || response.statusCode !== 200) {
// 				return res
// 					.status(500)
// 					.json({ type: 'error', message: error.message });
// 			}
// 			// res.json(body);
			
// 			console.log(typeof body)
// 			console.log(JSON.parse(body).result.records)
// 			const data = JSON.parse(body).result.records

// 			data.forEach(element => {
// 				delete element._id;
// 				Carparks.create(element), (err, createdCarpark) => {
// 					if(err) console.log(err);
// 					if(createdCarpark) {
// 						console.log('seed data is successful');
// 					}
// 				}
// 			});


			
// 		}
// 	);
// });



// app.get('/carparkListDetails', (req, res) => {
// 	console.log(req.query.token)
// 	const header = {
// 		'AccessKey': '3fe311cb-5e09-42cc-b91f-49469ced4d67',
// 		'Token': req.query.token
// 	}
// 	request(
// 		{
// 			url:
// 				'https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details',
// 			headers: header
// 		},
// 		(error, response, body) => {
// 			if (error || response.statusCode !== 200) {
// 				return res
// 					.status(500)
// 					.json({ type: 'error', message: error.message });
// 			}
// 			// res.json(body);
// 			res.send(body)
// 		}
// 	);
// });


// app.get('', async (req, res) => {
// 	const data = res.body.fields
// 	console.log(data)
  
// 	// try {
// 	//   const seedItems = await Product.create(newProducts)
// 	//   res.send(seedItems)
// 	// } catch (err) {
// 	//   res.send(err.message)
// 	// }
// })

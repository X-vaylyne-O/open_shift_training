const debugMode = process.env.NODE_ENV === 'debug';

// REQUIRE ALL THE LIBS!
const express = require('express');

const uuidv1 = require('uuid/v1');

// LOCAL LIBS
const { initSockets } = require('./local_modules/sockets');

// INIT LIBS
const app = express();

// GENERAL MIDDLEWARE
app.use(express.json({ limit: '5mb' }));

// CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	// if (req.method === 'OPTIONS') {
	// 	return res.sendStatus(204);
	// }
	return next();
});

// SET REQUEST ID IF NOT INCLUDED
app.use((req, res, next) => {
	const requestUUID = req.get('requestUUID');
	req.requestUUID = (/[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}/.test(requestUUID) ? requestUUID : uuidv1());
	next();
});


// ROUTES

// LOAD ROUTING FILES
const training = require('./api/training');

app.use('/', training);

// ERROR HANDLING
app.use((err, req, res, next) => {
	if (err.isJoi) {
		console.log(`${err.name}: ${err.details[0].message}`);
		res.status(400).json({ [err.name]: err.details[0].message });
	} else {
		res.status(500);
	}
	next(err);
});

app.use(
	(() => {
		if (debugMode) {
			return (err, req, res, next) => {
				const { message, code, stack } = err;
				res.json({ error: { message, code, stack } });
				next(err);
			};
		}
		return (err, req, res, next) => {
			res.end();
			next(err);
		};
	})()
);

// INIT SERVER
// let server;
const port = process.env.PORT || 3000;
// SOCKET SETUP
const server = initSockets(app);

const runServer = async (portNum) => {
	try {
		try {
			server.listen(port, '0.0.0.0', () => {
			// server = app.listen(port, '0.0.0.0', () => {
				console.log(`Server is listening on port ${portNum}`);
			});
		} catch (error) {
			throw error;
		}
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

const closeServer = async () => {
	try {
		server.close(() => {
			console.log('Server closed');
		});
	} catch (err) {
		console.log(err);
	}
};

// makes the file both an executable script, and a module.
if (require.main === module) {
	runServer(port).catch((err) => console.error(err));
}

module.exports = { app, runServer, closeServer };

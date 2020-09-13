const http = require('http');
const socketsIO = require('socket.io');

let loopIO = null;

function getLoopIO() {
	return loopIO;
}

// put on connection script here
function loopConnectFn() {
}

function initSockets(app) {
	const server = http.createServer(app);
	const io = socketsIO(server, { origins: '*:*' });
	loopIO = io.of('/loop').on('connection', loopConnectFn);
	io.on('connection', function(socket) {
		console.log('Made socket connection', socket.id);
	});
	return server;
}

module.exports = {
	initSockets,
	loopIO: getLoopIO
};

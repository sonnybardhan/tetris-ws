const WebSocketServer = require('ws').Server;
const Session = require('./session');
const Client = require('./client');

const server = new WebSocketServer({port: 9000});

const sessions = new Map;


function createId(len = 6, chars = 'abcdefghjkmnopqrstxyz0123456789'){
	let id = '';
	while(len--){
		id += chars[Math.random() * chars.length | 0];
	}
	return id;
}

server.on('connection', conn => {
	console.log('[server] Connection established');
	const client = new Client(conn);

	conn.on('message', msg => {
		console.log('[server] message received: ', msg);

		if(msg === 'create-session'){
			const id = createId();
			const session = new Session(id);
			session.join(client);
			sessions.set(session.id, session);
			client.send(session.id);
		}
	});

	conn.on('close', () => {
		console.log('[server] Connection closed.');
		const session = client.session;
		if(session){
			session.leave(client);
			if(session.clients.size === 0){
				sessions.delete(session.id);
			}
		}
	});
});
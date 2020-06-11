class ConnectionManager{
	constructor(tetrisManager){
		this.conn = null;
		this.peers = new Map;
		this.tetrisManager = tetrisManager;
		this.localTetris = [...tetrisManager.instances][0];
	}
	
	connect(address){
		this.conn = new WebSocket(address);

		this.conn.addEventListener('open', () => {
			console.log('[client] Connection established');
			this.initSession();
			this.watchEvents();
		});

		this.conn.addEventListener('message', event => {
			console.log('[client] Received message: ', event.data);
			this.receive(event.data);
		});
	}

	initSession(){
		const sessionId = window.location.hash.split('#')[1];
		if(sessionId){
			this.send({
				type: 'join-session',
				id: sessionId,
			});
		} else {
			this.send({type: 'create-session'});
		}   
	}

	receive(msg){
		const data = JSON.parse(msg);
		if(data.type === 'session-created'){
			window.location.hash = data.id;
		} else if(data.type === 'session-broadcast') {
			this.updateManager(data.peers);
		}
	}

	watchEvents(){
		const local = this.localTetris;
		const player = local.player;

		['pos', 'matrix', 'score'].forEach(prop => {
			player.events.listen(prop, (value) => {
				this.send({
					type: 'state-update',
					fragment: 'player',
					player: [prop, value],
				});
			});
		});

		// this.player.events.listen('pos', pos => {
		// 	console.log(`Player pos changed to, `, pos);
		// });

		// this.player.events.listen('matrix', matrix => {
		// 	console.log(`Player matrix changed to, `, matrix);
		// });

	}

	updateManager(peers){
		const me = peers.you;
		const clients = peers.clients.filter(id => me !== id);
		clients.forEach(id => {
			if(!this.peers.has(id)){
				const tetris = this.tetrisManager.createPlayer();
				this.peers.set(id, tetris);
			}
		});

		[...this.peers.entries()].forEach(([id, tetris]) => {
			if(clients.indexOf(id) === -1){
				this.tetrisManager.removePlayer(tetris);
				this.peers.delete(id);
			}
		});
	}

	send(data){
		const msg = JSON.stringify(data);
		console.log(`[client] Sending message: ${msg}`);
		this.conn.send(msg);
	}
}
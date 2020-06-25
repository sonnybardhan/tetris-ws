const tetrisManager = new TetrisManager(document);
const localTetris = tetrisManager.createPlayer();

localTetris.element.classList.add('local');
localTetris.run();

const connectionManager = new ConnectionManager(tetrisManager);
connectionManager.connect('ws://localhost:9000');

const keyListener = (event) => {
	[ [ 37, 39, 81, 69, 40 ] ].forEach((key, index) => {
		const player = localTetris.player;

		if (event.type === 'keydown') {
			if (event.keyCode === key[0]) {
				player.move(-1);
			} else if (event.keyCode === key[1]) {
				player.move(1);
			} else if (event.keyCode === key[2]) {
				player.rotate(-1);
			} else if (event.keyCode === key[3]) {
				player.rotate(1);
			}
		}

		if (event.keyCode === key[4]) {
			if (event.type === 'keydown') {
				if (player.dropInterval !== player.DROP_FAST) {
					player.drop();
					player.dropInterval = player.DROP_FAST;
				}
			} else {
				player.dropInterval = player.DROP_SLOW;
			}
		}
	});
};
// const keyListener = event => {
// 	[
// 		[65, 68, 81, 69, 83],
// 		[72, 75, 89, 73, 74],
// 	].forEach((key, index) => {
// 			const player = localTetris.player;

// 			if(event.type === 'keydown'){
// 				if(event.keyCode === key[0]){
// 					player.move(-1);
// 				} else if(event.keyCode === key[1]){
// 					player.move(1);
// 				} else if(event.keyCode === key[2]){
// 					player.rotate(-1);
// 				} else if(event.keyCode === key[3]){
// 					player.rotate(1);
// 				}
// 			}

// 			if(event.keyCode === key[4]){
// 				if(event.type === 'keydown'){
// 					if(player.dropInterval !== player.DROP_FAST){
// 						player.drop();
// 						player.dropInterval = player.DROP_FAST;
// 					}
// 				} else {
// 					player.dropInterval = player.DROP_SLOW;
// 				}
// 			}

// 	});
// }
////////////////////////////////

document.addEventListener('keydown', (event) => {
	if (event.keyCode === 37) {
		playerMove(-1);
	} else if (event.keyCode === 39) {
		playerMove(1);
	} else if (event.keyCode === 40) {
		playerDrop();
	} else if (event.keyCode === 81) {
		playerRotate(-1);
	} else if (event.keyCode === 87) {
		playerRotate(1);
	}
});

///////////////////

document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);

window.addEventListener(
	'keydown',
	function(e) {
		// space and arrow keys
		if ([ 32, 37, 38, 39, 40 ].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	},
	false
);

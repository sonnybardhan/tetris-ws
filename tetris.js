class Tetris{
	constructor(){
		let lastTime = 0;
		
		const update = (time = 0) => {
			const deltaTime = time - lastTime;
			lastTime = time;
			player.update(deltaTime);
			this.draw();
			requestAnimationFrame(update);
		}
		
		update();
	}

	draw(){
		context.fillStyle = '#000';
		context.fillRect(0, 0, canvas.clientWidth, canvas.height);
		this.drawMatrix(arena.matrix, {x: 0, y: 0});
		this.drawMatrix(player.matrix, player.pos);
	}

	drawMatrix(matrix, offset){
		matrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if(value !== 0){
					context.fillStyle = colors[value];
					context.fillRect(x + offset.x, 
													y + offset.y, 
													1, 1);
				}
			});
		});
	}

}
class Player{
	constructor(){
		this.dropCounter = 0;
		this.dropInterval = 750;
		this.pos = {x: 0, y: 0};
		this.matrix = null;
		this.score = 0;
		this.reset();
	}
	move(dir){
		this.pos.x += dir;
		if(arena.collide(this)){
			this.pos.x -= dir;
		}
	}
	rotate(dir){
		const pos = this.pos.x;
		let offset = 1;
		this._rotateMatrix(this.matrix, dir);
		while(arena.collide(this)){
			this.pos.x += offset;
			offset = -(offset + (offset > 0 ? 1 : -1));
			if(offset > this.matrix[0].length) {
				rotate(this.matrix, -dir);
				this.pos.x = pos;
				return;
			}
		}
	}

	drop(){
		this.pos.y++;
		if(arena.collide(this)) {
			this.pos.y--;
			arena.merge(this);
			this.reset();
			arena.sweep();
			updateScore();
		}
		this.dropCounter = 0;
	}

	update(deltaTime){
		this.dropCounter += deltaTime;
		if(this.dropCounter > this.dropInterval) {
			this.drop();
		}
	}


	reset(){
		const pieces = 'ILJOTSZ';
		this.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
		this.pos.y = 0;
		this.pos.x = (arena.matrix[0].length/2 | 0) - 
									(this.matrix[0].length / 2 | 0);
		if(arena.collide(this)){
			arena.clear();
			this.score = 0;
			updateScore();
		}
	}

 	_rotateMatrix(matrix, dir){
		for(let y = 0; y < matrix.length; ++y){
			for(let x = 0; x < y; ++x){
				[
					matrix[x][y],
					matrix[y][x],
				] = [
					matrix[y][x],
					matrix[x][y],
				];
			}
		}
		if(dir > 0) {
			matrix.forEach(row => row.reverse());
		} else {
			matrix.reverse();
		}
	}

}
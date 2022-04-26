class Game {
  constructor() {
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
    this.x = 0;
    this.y = 0;
    this.width = 1000;
    this.height = 450;
    this.intervalId = null;
    this.jerry = null;
    this.controls = null;
    this.enemies = [];
    this.frames = 0;
    this.points = [];
    this.score = 0;
    this.trap = [];
    this.life = 0;
    this.count = null;
    this.enemySpeed = 2;
  }

  start() {
    this.jerry = new Jerry(this, 0, 380, 70, 70);
    this.controls = new Controls(this);
    this.controls.keyboardEvents();
    this.count = 60 - Math.floor(this.frames / 60);
    this.intervalId = setInterval(() => {
      this.update();
    }, 1000 / 60);
  }

  drawTime() {
    let count = 60 - Math.floor(this.frames / 60);
    //count--;
    if (count < 60 && count >= 40) {
      this.enemySpeed = 2;
    } else if (count < 40 && count >= 20) {
      this.enemySpeed = 3;
    } else {
      this.enemySpeed = 4;
    }

    this.ctx.fillStyle = "black";
    this.ctx.font = "20px Times New Roman";
    this.ctx.fillText(`${count}`, 40, 70);
  }

  update() {
    this.frames++;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.jerry.draw();
    this.drawTime();
    this.jerry.stopJumping();

    this.createPoints();
    this.points.forEach((cheese) => {
      cheese.y++;
      cheese.draw();
    });

    this.createTrap();
    this.trap.forEach((trap) => {
      trap.y++;
      trap.draw();
    });

    this.createEnemies();
    this.enemies.forEach((enemy) => {
      enemy.x -= enemy.speed;
      enemy.draw();
    });

    this.checkGameOver3();
    this.checkPoints();
    this.checkGameOver();
    this.drawScores();
    if (this.life === 3) {
      this.stop();
    }

    this.drawWin();
  }

  createEnemies() {
    if (this.frames % 500 === 0) {
      this.enemies.push(new Enemy(this, this.enemySpeed));
    }
  }

  drawScores() {
    this.ctx.font = "32px serif";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(`Score: ${this.score}`, 800, 100);
  }

  createPoints() {
    if (this.frames % 300 === 0) {
      this.points.push(new Cheese(this));
      console.log(this.points);
    }
  }

  createTrap() {
    if (this.frames % 300 === 0) {
      this.trap.push(new Trap(this));
    }
  }

  // colisao com o bonus - cheese
  checkPoints() {
    const jerry = this.jerry;
    let cheeseRemove = null;

    const crashed2 = this.points.some(function (cheese, i) {
      cheeseRemove = i;
      return jerry.crashWith(cheese);
    });
    if (crashed2) {
      this.score++;
      this.points.splice(cheeseRemove, 1);
    }
  }
  /////colisao com o TOM
  checkGameOver() {
    const jerry = this.jerry;
    const crashed = this.enemies.some(function (enemy) {
      return jerry.crashWith(enemy);
    });
    if (crashed) {
      this.life++;
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.font = "32px serif";
      this.ctx.fillStyle = "black";
      this.ctx.fillText(`Game Over`, 400, 100);
    }
  }

  /////colisao com a armadilha - Game over imediato
  checkGameOver3() {
    const jerry = this.jerry;
    const crashed3 = this.trap.some(function (trap) {
      return jerry.crashWith(trap);
    });
    if (crashed3) {
      this.stop();
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.font = "32px serif";
      this.ctx.fillStyle = "black";
      this.ctx.fillText(`Game Over`, 400, 100);
    }
  }

  stop() {
    clearInterval(this.intervalId);
  }

  drawWin() {
    if (this.count - Math.floor(this.frames / 60) === 0) {
      this.stop();
      setInterval(() => {
        if (this.jerry.x < 1000) {
          this.ctx.clearRect(0, 0, this.width, this.height);
          this.jerry.x++;
          this.jerry.draw();
        } else {
          this.ctx.clearRect(0, 0, this.width, this.height);
          this.ctx.font = "32px serif";
          this.ctx.fillStyle = "black";
          this.ctx.fillText(`YOU WIN! Score: ${this.score}`, 400, 100);
        }
      }, 1000 / 60);
    }
  }
}
// import * as PIXI from "./pixi";

const LEFT = -1;
const RIGHT = 1;

const app = new PIXI.Application();

class Player extends PIXI.Sprite {
  dx = 0;
  offset = 15;
  beams = [];

  constructor(texture) {
    super(texture);
    this.x = app.renderer.width / 2;
    this.y = app.renderer.height - this.height - this.offset;
    this.attachKeyboardListeners();

    app.stage.addChild(this);
  }

  attachKeyboardListeners = () => {
    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        this.dx = 3;
      }
      if (event.key === "ArrowLeft") {
        this.dx = -3;
      }
      if (event.key === " ") {
        const beamX = this.x + this.width / 2;
        const beamY = this.y;
        const beam = new Beam(beamX, beamY);
        this.beams.push(beam);
      }
    });

    window.addEventListener("keyup", () => {
      this.dx = 0;
    });
  };

  stageIntersect = () => {
    if (this.x + this.width > app.renderer.width) {
      this.x = app.renderer.width - this.width;
    }

    if (this.x < 0) {
      this.x = 0;
    }

    this.x += this.dx;

    this.beams.forEach((beam) => {
      beam.stageIntersect();
    });
  };
}

class Beam extends PIXI.Graphics {
  dy = 4;

  constructor(x, y) {
    super();
    this.rect(0, 0, 6, 20);
    this.fill(0x0000ff);
    this.x = x - this.width / 2;
    this.y = y;

    app.stage.addChild(this);
  }

  stageIntersect = () => {
    if (this.y < 0) {
      app.stage.removeChild(this);
    }

    this.y -= this.dy;
  };
}

class Enemy extends PIXI.Sprite {
  dx = 2;
  direction = LEFT;

  constructor(texture) {
    super(texture);
    this.x = app.renderer.width / 2;
    this.y = app.renderer.height / 2;

    app.stage.addChild(this);
  }

  stageIntersect = () => {
    if (this.x + this.width > app.renderer.width) {
      this.direction = LEFT;
    }

    if (this.x < 0) {
      this.direction = RIGHT;
    }

    this.x += this.dx * this.direction;
  };
}

(async () => {
  await app.init();
  document.body.appendChild(app.canvas);

  const playerTexture = await PIXI.Assets.load("./assets/player.png");
  const player = new Player(playerTexture);

  const enemyTexture = await PIXI.Assets.load("./assets/enemy.png");
  const enemy = new Enemy(enemyTexture);

  app.ticker.add(() => {
    enemy.stageIntersect();
    player.stageIntersect();
  });
})();

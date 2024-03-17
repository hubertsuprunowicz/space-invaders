// import * as PIXI from "./pixi";

const LEFT = -1;
const RIGHT = 1;

const app = new PIXI.Application();

class Player extends PIXI.Sprite {
  dx = 0;
  offset = 15;
  beam = undefined;

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
        if (this.beam) return;

        const beamX = this.x + this.width / 2;
        const beamY = this.y;
        this.beam = new Beam(beamX, beamY);
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
  };
}

class Beam extends PIXI.Graphics {
  dy = 5;

  constructor(x, y) {
    super();
    this.rect(0, 0, 6, 20);
    this.fill(0x0000ff);
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;

    app.stage.addChild(this);
  }

  intersectWith = (obj) => {
    const xOverlap = this.x < obj.x + obj.width && this.x + this.width > obj.x;
    const yOverlap =
      this.y < obj.y + obj.height && this.y + this.height > obj.y;

    return xOverlap && yOverlap;
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
    enemy?.stageIntersect();
    player?.stageIntersect();

    if (player.beam) {
      if (player.beam.y < 0) {
        app.stage.removeChild(player.beam);
        player.beam = null;
        return;
      }

      if (player.beam.intersectWith(enemy)) {
        app.stage.removeChild(enemy);
        app.stage.removeChild(player.beam);
        player.beam = null;
        return;
      }

      player.beam.y -= player.beam.dy;
    }
  });
})();

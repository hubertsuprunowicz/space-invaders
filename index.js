// import * as PIXI from "./pixi";
// npx http-server --proxy http://localhost:8080?

const LEFT = -1;
const RIGHT = 1;
const ENEMIES_QUANTITY_PER_ROW = 3;
const ENEMIES_ROWS = 1;

const app = new PIXI.Application();
const playerTexture = await PIXI.Assets.load("./assets/player.png");
const enemyTexture = await PIXI.Assets.load("./assets/enemy.png");
let score = 0;

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
    const xOverlap = this.x < obj.maxX && this.x + this.width > obj.minX;
    const yOverlap = this.y < obj.maxY && this.y + this.height > obj.minY;

    return xOverlap && yOverlap;
  };
}

class Enemy extends PIXI.Sprite {
  dx = 2;
  direction = LEFT;

  constructor(texture, i, j) {
    super(texture);
    const gap = 20;
    const yOffset = 20;
    this.x = (this.width + gap) * j;
    this.y = (this.height + gap) * i + yOffset;
  }
}

class EnemyContainer extends PIXI.Container {
  dx = 2;
  direction = LEFT;

  constructor() {
    super();
    this.enemies = Array.from({ length: ENEMIES_ROWS }).map((_, i) =>
      Array.from({ length: ENEMIES_QUANTITY_PER_ROW }).map(
        (_, j) => new Enemy(enemyTexture, i, j)
      )
    );

    this.enemies.forEach((row) =>
      row.forEach((enemy) => {
        this.addChild(enemy);
      })
    );

    app.stage.addChild(this);
  }

  resize = () => {
    if (this.children.at(-1)) this.children.at(-1).uid = Math.random();
  };

  stageIntersect = () => {
    const { maxX, minX } = this.getBounds();
    if (maxX > app.renderer.width || minX > app.renderer.width) {
      this.direction = LEFT;
      this.moveDown();
    }

    if (maxX < 0 || minX < 0) {
      this.direction = RIGHT;
    }

    this.x += this.dx * this.direction;
  };

  moveDown = () => {
    this.y += 40;
  };
}

(async () => {
  await app.init();
  document.body.appendChild(app.canvas);

  const player = new Player(playerTexture);
  const enemiesContainer = new EnemyContainer();

  const textScore = new PIXI.Text({
    text: "Score: " + score,
    style: {
      fill: "0xff1010",
      fontFamily: "Arial",
      fontSize: 24,
      align: "center",
    },
  });
  textScore.x = app.renderer.width / 2 - textScore.width / 2;
  textScore.alpha = 0.5;

  app.stage.addChild(textScore);

  app.ticker.add(() => {
    player.stageIntersect();
    enemiesContainer.stageIntersect();

    score =
      (ENEMIES_QUANTITY_PER_ROW * ENEMIES_ROWS -
        enemiesContainer.children.length) *
      10;

    textScore.text = "Score: " + score;

    if (player.beam) {
      if (player.beam.y < 0) {
        app.stage.removeChild(player.beam);
        player.beam = null;
        return;
      }

      enemiesContainer.enemies.forEach((row) =>
        row.forEach((enemy) => {
          if (player.beam && player.beam.intersectWith(enemy.getBounds())) {
            enemiesContainer.removeChild(enemy);
            app.stage.removeChild(player.beam);
            player.beam = null;
            enemiesContainer.resize();
            return;
          }
        })
      );

      if (player.beam) player.beam.y -= player.beam.dy;
    }
  });
})();

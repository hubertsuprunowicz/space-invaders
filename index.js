// import * as PIXI from "./pixi";

const LEFT = -1;
const RIGHT = 1;
const PLAYER_POSITION_OFFSET = 15;

let enemyDirection = RIGHT;
let enemySpeed = 2;

class Player extends PIXI.Sprite {
  dx = 0;
  constructor(texture) {
    super(texture);
    this.attachKeyboardListeners();
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
        console.log("space");
      }
    });

    window.addEventListener("keyup", () => {
      this.dx = 0;
    });
  };
}

(async () => {
  const app = new PIXI.Application();
  await app.init();
  document.body.appendChild(app.canvas);

  const playerTexture = await PIXI.Assets.load("./assets/player.png");
  const player = new Player(playerTexture);
  player.dx = 0;
  player.x = app.renderer.width / 2;
  player.y = app.renderer.height - player.height - PLAYER_POSITION_OFFSET;
  app.stage.addChild(player);

  const enemyTexture = await PIXI.Assets.load("./assets/enemy.png");
  const enemy = new PIXI.Sprite(enemyTexture);
  enemy.x = app.renderer.width / 2;
  enemy.y = app.renderer.height / 2;
  app.stage.addChild(enemy);

  app.ticker.add(() => {
    if (enemy.x + enemy.width > app.renderer.width) {
      enemyDirection = LEFT;
    }

    if (enemy.x < 0) {
      enemyDirection = RIGHT;
    }

    enemy.x += enemySpeed * enemyDirection;

    if (player.x + player.width > app.renderer.width) {
      player.x = app.renderer.width - player.width;
    }

    if (player.x < 0) {
      player.x = 0;
    }
    player.x += player.dx;
  });
})();

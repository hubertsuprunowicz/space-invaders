// import * as PIXI from "./pixi";

const LEFT = -1;
const RIGHT = 1;

(async () => {
  const app = new PIXI.Application();
  await app.init();
  document.body.appendChild(app.canvas);

  const playerTexture = await PIXI.Assets.load("./assets/player.png");
  const player = new PIXI.Sprite(playerTexture);
  player.x = app.renderer.width / 2;
  player.y = app.renderer.height - player.height;
  app.stage.addChild(player);

  const enemyTexture = await PIXI.Assets.load("./assets/enemy.png");
  const enemy = new PIXI.Sprite(enemyTexture);
  enemy.x = app.renderer.width / 2;
  enemy.y = app.renderer.height / 2;
  app.stage.addChild(enemy);

  let direction = RIGHT;
  let enemySpeed = 2;

  app.ticker.add(() => {
    if (enemy.x + enemy.width > app.renderer.width) {
      direction = LEFT;
    }

    if (enemy.x < 0) {
      direction = RIGHT;
    }

    enemy.position.x += enemySpeed * direction;
  });
})();

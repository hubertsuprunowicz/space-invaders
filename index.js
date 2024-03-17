(async () => {
  const app = new PIXI.Application();
  await app.init();
  document.body.appendChild(app.canvas);

  const texture = await PIXI.Assets.load("./assets/bunny.png");
  const bunny = new PIXI.Sprite(texture);

  bunny.x = app.renderer.width / 2;
  bunny.y = app.renderer.height / 2;

  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;

  app.stage.addChild(bunny);

  app.ticker.add(() => {
    bunny.rotation += 0.01;
  });
})();

//global vars
var currentImage;

//global functions
function getImage() {
  return currentImage;
}

window.addEventListener("load", function (event) {

  "use strict";

  //CLASSES

  const AssetsManager = function () {

    this.tile_set_image = undefined;

  };

  AssetsManager.prototype = {

    constructor: Game.AssetsManager,

    requestZone: function (id, callback) {

      callback(getZone(id))

    },

    requestImage: function (url, callback) {

      let image = new Image();

      image.addEventListener("load", function (event) {

        callback(image);

      }, { once: true });

      image.src = url;

    },

  };


  // FUNCTIONS

  var keyDownUp = function (event) {

    controller.keyDownUp(event.type, event.keyCode);

  };

  var resize = function (event) {

    //display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, game.world.height / game.world.width);
    display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, game.world.height / game.world.width);
    //display.render();
    display.render();

    var rectangle = display.context.canvas.getBoundingClientRect();

  };

  var render = function () {

    var frame = undefined;

    //calls function drawmap from display then passes loaded image
    display.drawMap(assets_manager.tile_set_image,
      game.world.tile_set.columns, game.world.graphical_map, game.world.columns, game.world.tile_set.tile_size);

    viewport.drawMap(assets_manager.tile_set_image,
      game.world.tile_set.columns, game.world.tile_set.tile_size, game.world.tile_set.scaled_size);

    for (let index = game.world.carrots.length - 1; index > -1; --index) {

      let carrot = game.world.carrots[index];

      frame = game.world.tile_set.frames[carrot.frame_value];

      display.drawObject(assets_manager.tile_set_image,
        frame.x, frame.y,
        carrot.x + Math.floor(carrot.width * 0.5 - frame.width * 0.5) + frame.offset_x,
        carrot.y + frame.offset_y, frame.width, frame.height);

    }

    frame = game.world.tile_set.frames[game.world.player.frame_value];

    display.drawObject(assets_manager.tile_set_image,
      frame.x, frame.y,
      game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offset_x,
      game.world.player.y + frame.offset_y, frame.width, frame.height);

    //viewport.drawObject(assets_manager.tile_set_image,
      //frame.x, frame.y,
      //game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offset_x,
      //game.world.player.y + frame.offset_y, frame.width, frame.height);

    for (let index = game.world.grass.length - 1; index > -1; --index) {

      let grass = game.world.grass[index];

      frame = game.world.tile_set.frames[grass.frame_value];

      display.drawObject(assets_manager.tile_set_image,
        frame.x, frame.y,
        grass.x + frame.offset_x,
        grass.y + frame.offset_y, frame.width, frame.height);

    }

    var player = getPlayer();
    viewport.scrollTo(player.x, player.y);
    //console.log(viewport);

    display.render();
    //viewport.render();

  };

  var update = function () {

    if (controller.left.active) { game.world.player.moveLeft(); }
    if (controller.right.active) { game.world.player.moveRight(); }
    if (controller.up.active) { game.world.player.jump(); controller.up.active = false; console.log(viewport); }
    if (controller.space.active) { game.world.player.jump(); controller.space.active = false; }
    if (controller.shift.active) { game.world.player.dash(); controller.space.active = false; }

    game.update();

    if (game.world.door) {

      engine.stop();

      assets_manager.requestZone((zone) => {

        game.world.setup(zone);

        engine.start();

      });

      return;

    }

  };

  // OBJECTS

  var assets_manager = new AssetsManager();
  var controller = new Controller();
  var display = new Display(document.querySelector("canvas"));
  var viewport = new Viewport(200, 200, 300, 300);
  var game = new Game();
  var engine = new Engine(1000 / 60, render, update);


  // INITIALIZE

  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;
  display.buffer.imageSmoothingEnabled = false;

  assets_manager.requestZone(0, (zone) => {
    game.world.setup(zone);

    assets_manager.requestImage("platformer-demo.png", (image) => {

      assets_manager.tile_set_image = image;
      currentImage = image;

      resize();
      engine.start();

    });

  });

  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup", keyDownUp);
  window.addEventListener("resize", resize);

});

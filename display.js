const Viewport = function (x, y, w, h) {

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;

  this.context = document.querySelector("canvas").getContext("2d");

  this.height = document.documentElement.clientHeight;
  this.width = document.documentElement.clientWidth;

  this.context.canvas.height = this.height;
  this.context.canvas.width = this.width;

  this.context.imageSmoothingEnabled = false;

};


Viewport.prototype = {

  scrollTo: function (x, y) {
    this.x = x - this.w * 0.5;
    this.y = y - this.w * 0.5;
  },

  render: function () {
    this.context.fillStyle = '#008000';
    this.context.fillRect(0, 0, this.width, this.height);
  },

};

const Display = function (canvas) {

  this.buffer = document.createElement("canvas").getContext("2d"),
    this.context = canvas.getContext("2d");

  /* This function draws the map to the buffer. */
  this.drawMap = function (image, image_columns, map, map_columns, tile_size) {

    for (let i = map.length - 1; i > -1; --i) {

      let value = map[i];
      let source_x = (value % image_columns) * tile_size;
      let source_y = Math.floor(value / image_columns) * tile_size;
      let destination_x = (i % map_columns) * tile_size;
      let destination_y = Math.floor(i / map_columns) * tile_size;

      this.buffer.drawImage(image, source_x, source_y, tile_size, tile_size, destination_x, destination_y, tile_size, tile_size);

    }

  };

  this.drawObject = function (image, source_x, source_y, destination_x, destination_y, width, height) {

    this.buffer.drawImage(image, source_x, source_y, width, height, Math.round(destination_x), Math.round(destination_y), width, height);

  };

  this.resize = function (width, height, height_width_ratio) {

    if (height / width > height_width_ratio) {

      this.context.canvas.height = width * height_width_ratio;
      this.context.canvas.width = width;

    } else {

      this.context.canvas.height = height;
      this.context.canvas.width = height / height_width_ratio;

    }

    this.context.imageSmoothingEnabled = false;

  };

};

Display.prototype = {

  constructor: Display,

  render: function () {
    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
  },

};

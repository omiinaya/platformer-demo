var scaled_size = 16;
var sprite_size = 16;

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

  /* Get the min and max column and row in the map to draw. For the min
  column and row (x and y) we use floor to round down and for the max we
  use ceil to round up. We want to get the rows and columns under the borders
  of the viewport rectangle. This is visualized by the white square in the example. */
  var x_min = Math.floor(this.x / scaled_size);
  var y_min = Math.floor(this.y / scaled_size);
  var x_max = Math.ceil((this.x + this.w) / scaled_size);
  var y_max = Math.ceil((this.y + this.h) / scaled_size);

  /* the min and max column and row values cannot go beyond the boundaries
  of the map. Those values are 0 and the number of columns and rows in the map. */


  /* Now we loop through the tiles in the map, but only between the min
  and max columns and rows that the viewport is over. To do this we use two
  for loops, one for the columns (x) and one for the rows (y) of the map. */

  this.drawMap = function (image, columns, map, columns, tile_size) {

    if (x_min < 0) x_min = 0;
    if (y_min < 0) y_min = 0;
    if (x_max > columns) x_max = columns;
    if (y_max > rows) y_max = rows;

    for (let x = x_min; x < x_max; x++) {

      for (let y = y_min; y < y_max; y++) {

        let value = map[y * columns + x];// Tile value
        let source_x = Math.floor(x * tile_size - this.x + width * 0.5 - this.w * 0.5);// Tile x destination for drawing
        let source_y = Math.floor(y * tile_size - this.y + height * 0.5 - this.h * 0.5);// Tile y destination for drawing

        // Draw tile from tile_sheet
        context.drawImage(image, value * sprite_size, 0, sprite_size, sprite_size, source_x, source_y, tile_size, tile_size);

      }
    }
  }
};

Viewport.prototype = {

  scrollTo: function (x, y) {
    this.x = x - this.w * 0.5;
    this.y = y - this.w * 0.5;
  },

  render: function () {
    this.context.drawImage(this.context.canvas, 0, 0, this.context.canvas.width, this.context.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
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

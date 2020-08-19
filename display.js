//global vars
var viewport;

const Viewport = function (x, y, w, h) {
  viewport = this;

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

  //drawmap needs to receive tilesheet, columns, rows, sprite size and scaled size.
  this.drawMap = function(tile_sheet, columns, rows, sprite_size, scaled_size) {

    var x_min = Math.floor(viewport.x / scaled_size);
    var y_min = Math.floor(viewport.y / scaled_size);
    var x_max = Math.ceil((viewport.x + viewport.w) / scaled_size);
    var y_max = Math.ceil((viewport.y + viewport.h) / scaled_size);

    /* the min and max column and row values cannot go beyond the boundaries
    of the map. Those values are 0 and the number of columns and rows in the map. */
    if (x_min < 0) x_min = 0;
    if (y_min < 0) y_min = 0;
    if (x_max > columns) x_max = columns;
    if (y_max > rows) y_max = rows;

    /* Now we loop through the tiles in the map, but only between the min
    and max columns and rows that the viewport is over. To do this we use two
    for loops, one for the columns (x) and one for the rows (y) of the map. */
    for (let x = x_min; x < x_max; x ++) {

      for (let y = y_min; y < y_max; y ++) {

        let value = map[y * columns + x];// Tile value
        let tile_x = Math.floor(x * scaled_size - viewport.x + width * 0.5 - viewport.w * 0.5);// Tile x destination for drawing
        let tile_y = Math.floor(y * scaled_size - viewport.y + height * 0.5 - viewport.h * 0.5);// Tile y destination for drawing

        // Draw tile from tile_sheet
        context.drawImage(tile_sheet, value * sprite_size, 0, sprite_size, sprite_size, tile_x, tile_y, scaled_size, scaled_size);

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
    //this.context.fillStyle = '#008000';
    //this.context.fillRect(0, 0, this.width, this.height);

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

    this.buffer.drawImage(getImage(), source_x, source_y, width, height, Math.round(destination_x), Math.round(destination_y), width, height);

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
    //passes canvas, x, y, canvas.width, canvas.height, 0, 0, 
    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
  },

};

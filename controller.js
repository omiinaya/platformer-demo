const Controller = function() {

  this.left  = new Controller.ButtonInput();
  this.right = new Controller.ButtonInput();
  this.up    = new Controller.ButtonInput();
  this.space = new Controller.ButtonInput();
  this.shift = new Controller.ButtonInput();

  this.keyDownUp = function(type, key_code) {

    var down = (type == "keydown") ? true : false;

    switch(key_code) {
      //wasd
      case 65: this.left.getInput(down); break;
      case 68: this.right.getInput(down); break;
      case 87: this.up.getInput(down); break;
      //arrow keys
      case 37: this.left.getInput(down);  break;
      case 38: this.up.getInput(down);    break;
      case 39: this.right.getInput(down); break;
      //others
      case 32: this.space.getInput(down); break;
      case 16: this.shift.getInput(down);

    }

  };

};

Controller.prototype = {

  constructor : Controller

};

Controller.ButtonInput = function() {

  this.active = this.down = false;

};

Controller.ButtonInput.prototype = {

  constructor : Controller.ButtonInput,

  getInput : function(down) {

    if (this.down != down) this.active = down;
    this.down = down;

  }

};

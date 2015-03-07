var Player = function(x, y) {
  this._x = x;
  this._y = y;
  this._draw();
}

Player.prototype._draw = function() {
  Game.display.draw(this._x, this._y, "@", "#ff0");
}

Game.player = null;

Game._createPlayer = function(freeCells) {
  var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
  var key = freeCells.splice(index, 1)[0];
  var parts = key.split(",");
  var x = parseInt(parts[0]);
  var y = parseInt(parts[1]);
  this.player = new Player(x, y);
};

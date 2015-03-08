var Player = function(x, y) {
  this._x = x;
  this._y = y;
  this._draw();
}

Player.prototype._draw = function() {
  Game.display.draw(this._x, this._y, "@", "#ff0");
}

Player.prototype.getX = function() { return this._x; }
Player.prototype.getY = function() { return this._y; }

Player.prototype.isVisible = function() {
  var key = this._x + "," + this._y;
  if(Game.map[key][0] != "*") {
    return true;
  } else {
    return false;
  };
}

Game.player = null;

Player.prototype.handleEvent = function(e) {
  var keyMap = {};
  keyMap[38] = 0;
  keyMap[33] = 1;
  keyMap[39] = 2;
  keyMap[34] = 3;
  keyMap[40] = 4;
  keyMap[35] = 5;
  keyMap[37] = 6;
  keyMap[36] = 7;

  var code = e.keyCode;
  /* one of numpad directions? */
  if (!(code in keyMap)) { return; }

  /* is there a free space? */
  var dir = ROT.DIRS[8][keyMap[code]];
  var newX = this._x + dir[0];
  var newY = this._y + dir[1];
  var newKey = newX + "," + newY;

  Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y][0], Game.map[this._x+","+this._y][1]['color']);
  this._x = newX;
  this._y = newY;
  this._draw();
  this._checkCity();
  this._checkMountain();
  window.removeEventListener("keydown", this);
  Game.engine.unlock();
}

Player.prototype.act = function() {
    Game.engine.lock();
    window.addEventListener("keydown", this);
}

Player.prototype._checkCity = function() {
  var key = this._x + "," + this._y;
  if (Game.map[key][0] == "C") {
      alert("Welcome to the City!");
  };
}

Player.prototype._checkMountain = function() {
  var key = this._x + "," + this._y;
  if (Game.map[key][0] == "^") {
    Game.enemy.act();
  };
}

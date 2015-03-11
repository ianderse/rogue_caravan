var Trader = function(x, y) {
  this._x = x;
  this._y = y;
  this._draw();
  this.speed = 80;
}

Trader.prototype._draw = function() {
  Game.display.draw(this._x, this._y, "T", "blue");
}

Trader.prototype.getX = function() { return this._x; }
Trader.prototype.getY = function() { return this._y; }
Trader.prototype.getSpeed = function() { return this.speed; }

Trader.prototype.act = function() {
  if(this.startCity === Game.firstCityKey) {
    var parts = Game.secondCityKey.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
  } else {
    var parts = Game.firstCityKey.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
  }

  var passableCallback = function(x, y) {
    return (x+","+y in Game.map);
  }
  var astar = new ROT.Path.AStar(x, y, passableCallback, {topology: 8});

  var path = [];
  var pathCallback = function(x, y) {
    path.push([x, y]);
  }
  astar.compute(this._x, this._y, pathCallback);
  path.shift();

  if (path.length <= 1) {
    /* delete trader if path ended or if bandit catches */
  } else {
    x = path[0][0];
    y = path[0][1];
    Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y][0], Game.map[this._x+","+this._y][1]['color']);
    this._x = x;
    this._y = y;
    this._checkTerrain();
    this._draw();
  };
}

Trader.prototype._checkTerrain = function () {
  if(Game.map[this._x+","+this._y][0] == "^") {
    this.speed = 25;
  } else if(Game.map[this._x+","+this._y][0] == " ") {
    this.speed = 50;
  } else if(Game.map[this._x+","+this._y][0] == "*") {
    this.speed = 33;
  };
}

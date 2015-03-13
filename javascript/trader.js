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

Trader.prototype.removeTrader = function(entity) {
  var key = this.getX() + ',' + this.getY();
  Game.scheduler.remove(this);
  Game.freeCells.push(key);
  var trader = this;
  Game.trader = _.filter(Game.trader, function(x) { return x != trader });
  if(entity) {
    entity._draw();
  } else {
    var glyph = Game.map[this._x+","+this._y]
    Game.display.draw(this._x, this._y, glyph.getChar(), glyph.getForeground());
  }
}

Trader.prototype.isVisible = function() {
  var key = this._x + "," + this._y;
  if(Game.map[key] != Game.Tile.forestTile) {
    return true;
  } else {
    return false;
  };
}

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
    this.removeTrader();
    var glyph = Game.map[this._x+","+this._y]
    Game.display.draw(this._x, this._y, glyph.getChar(), glyph.getForeground());
  } else {
    x = path[0][0];
    y = path[0][1];
    var glyph = Game.map[this._x+","+this._y]
    Game.display.draw(this._x, this._y, glyph.getChar(), glyph.getForeground());
    this._x = x;
    this._y = y;
    checkTerrain(this);
    this._draw();
  };
}

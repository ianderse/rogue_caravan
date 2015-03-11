var Enemy = function(x, y) {
  this._x = x;
  this._y = y;
  this._draw();
  this.speed = 50;
}

Enemy.prototype.getSpeed = function() { return this.speed; }
Enemy.prototype.getX = function() { return this._x; }
Enemy.prototype.getY = function() { return this._y; }

Enemy.prototype.removeEnemy = function() {
  var key = this.getX() + ',' + this.getY();
  Game.map[key][0] = ' ';
  Game.scheduler.remove(this);
  Game.freeCells.push(key);
}

Enemy.prototype._draw = function() {
  Game.display.draw(this._x, this._y, "B", "red");
}

Enemy.prototype.act = function() {
  var x = Game.player.getX();
  var y = Game.player.getY();
  var passableCallback = function(x, y) {
    return (x+","+y in Game.map);
  }
  var topo = [4,8].random();
  var astar = new ROT.Path.AStar(x, y, passableCallback, {topology: topo});
  /* if (Game.player._x - this._x + same for Y < Game.trader._x - this._x + same for Y), go after player, else trader */

  var path = [];
  var pathCallback = function(x, y) {
    path.push([x, y]);
  }
  astar.compute(this._x, this._y, pathCallback);
  path.shift();

  if (path.length <= 1) {
    Game.gameOver = true;
    Game.engine.lock();
  } else {
    if(Game.player.isVisible() == true || path.length < 5 ) {
      x = path[0][0];
      y = path[0][1];
      Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y][0], Game.map[this._x+","+this._y][1]['color']);
      this._x = x;
      this._y = y;
      this._checkTerrain();
      this._draw();
    };
  };
}

Enemy.prototype._checkTerrain = function () {
  if(Game.map[this._x+","+this._y][0] == "^") {
    this.speed = 25;
  } else if(Game.map[this._x+","+this._y][0] == " ") {
    this.speed = 50;
  } else if(Game.map[this._x+","+this._y][0] == "*") {
    this.speed = 33;
  };
}

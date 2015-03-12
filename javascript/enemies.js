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
  var target = 'player';
  var enemy = this;
  var traderObj = null;
  var path = [];

  if(Game.trader.length > 0) {
    _.each(Game.trader, function(trader) {
      var playerPath = [];
      var playerPathCallback = function(x, y) {
        playerPath.push([x, y]);
      };
      var traderPath = [];
      var traderPathCallback = function(x, y) {
        traderPath.push([x, y]);
      };
      var playerAstar = new ROT.Path.AStar(x, y, passableCallback, {topology: topo});
      var traderAstar = new ROT.Path.AStar(trader._x, trader._y, passableCallback, {topology: topo});
      playerAstar.compute(enemy._x, enemy._y, playerPathCallback);
      traderAstar.compute(enemy._x, enemy._y, traderPathCallback);
      if (playerPath.length < traderPath.length) {
        astar = playerAstar;
        target = 'player';
      } else {
        astar = traderAstar;
        target = 'trader';
        traderObj = trader;
      }
    });
  } else {
    var astar = new ROT.Path.AStar(x, y, passableCallback, {topology: topo});
    target = 'player'
  }

  var path = [];
  var pathCallback = function(x, y) {
    path.push([x, y]);
  }

  astar.compute(this._x, this._y, pathCallback);
  path.shift();

  if (path.length <= 1 && target === 'player') {
    Game.gameOver = true;
    Game.engine.lock();
  } else if (path.length <= 1 && target === 'trader') {
    traderObj.removeTrader();
    Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y][0], Game.map[this._x+","+this._y][1]['color']);
  } else {
    if(Game.player.isVisible() == true || path.length < 5 && target === 'player') {
      x = path[0][0];
      y = path[0][1];
      Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y][0], Game.map[this._x+","+this._y][1]['color']);
      this._x = x;
      this._y = y;
      this._checkTerrain();
      this._draw();
    } else if(traderObj && traderObj.isVisible() == true || path.length < 5 && target === 'trader') {
      x = path[0][0];
      y = path[0][1];
      Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y][0], Game.map[this._x+","+this._y][1]['color']);
      this._x = x;
      this._y = y;
      this._checkTerrain();
      this._draw();
    } else {
      var options = [0,1,-1];
      var newX = this._x + options.random();
      var newY = this._y + options.random();
      Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y][0], Game.map[this._x+","+this._y][1]['color']);
      if (newX === -1 || newX === 80) {
        this._x;
      } else {
        this._x = newX;
      };
      if (newY === -1 || newY === 25) {
        this._y;
      } else {
        this._y = newY;
      };
      this._checkTerrain();
      this._draw();
    }
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

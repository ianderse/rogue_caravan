var Enemy = function(x, y) {
  this._x = x;
  this._y = y;
  this._draw();
  this.speed = 50;
  this.currentTarget = Game.player;
}

Enemy.prototype.getSpeed = function() { return this.speed; }
Enemy.prototype.getX = function() { return this._x; }
Enemy.prototype.getY = function() { return this._y; }

Enemy.prototype.removeEnemy = function() {
  var key = this.getX() + ',' + this.getY();
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
  var enemy = this;
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
        if(enemy.currentPath && (enemy.currentPath.length < playerPath.length)) {
          path = enemy.currentPath;
        };
        path = playerPath;
        enemy.currentTarget = Game.player;
        enemy.currentPath = playerPath;
      } else {
        if(enemy.currentPath && (enemy.currentPath.length < traderPath.length)) {
          path = enemy.currentPath;
        };
        path = traderPath;
        enemy.currentTarget = trader;
        enemy.currentPath = traderPath;
      };
    });
  } else {
    var astar = new ROT.Path.AStar(x, y, passableCallback, {topology: topo});
    var pathCallback = function(x, y) {
      path.push([x, y]);
    }
    astar.compute(this._x, this._y, pathCallback);
    enemy.currentTarget = Game.player;
  }

  path.shift();

  if (path.length <= 1 && this.currentTarget.constructor === Player) {
    Game.gameOver = true;
    Game.engine.lock();
  } else if (path.length <= 1 && this.currentTarget.constructor === Trader) {
    enemy.currentTarget.removeTrader(this);
    var glyph = Game.map[this._x+","+this._y]
    Game.display.draw(this._x, this._y, glyph.getChar(), glyph.getForeground());
  } else {
    if(this.currentTarget.constructor === Player && (Game.player.isVisible() == true || path.length < 5)) {
      this._setPath(path);
    } else if(enemy.currentTarget.constructor === Trader && (enemy.currentTarget.isVisible() == true || path.length < 5)) {
      this._setPath(path);
    } else {
      var options = [0,1,-1];
      var newX = this._x + options.random();
      var newY = this._y + options.random();
      var glyph = Game.map[this._x+","+this._y]
      Game.display.draw(this._x, this._y, glyph.getChar(), glyph.getForeground());
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
      checkTerrain(this);
      this._draw();
    }
  };
}

Enemy.prototype._setPath = function(path) {
  x = path[0][0];
  y = path[0][1];
  var glyph = Game.map[this._x+","+this._y]
  Game.display.draw(this._x, this._y, glyph.getChar(), glyph.getForeground());
  this._x = x;
  this._y = y;
  checkTerrain(this);
  this._draw();
}

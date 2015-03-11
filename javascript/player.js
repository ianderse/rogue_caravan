var Player = function(x, y) {
  this._x = x;
  this._y = y;
  this._draw();
  this.speed = 100;
}

Player.prototype._draw = function() {
  Game.display.draw(this._x, this._y, "@", "#ff0");
}

Player.prototype.getX = function() { return this._x; }
Player.prototype.getY = function() { return this._y; }
Player.prototype.getSpeed = function() { return this.speed; }

Player.prototype.isVisible = function() {
  var key = this._x + "," + this._y;
  if(Game.map[key][0] != "*") {
    return true;
  } else {
    return false;
  };
}

Player.prototype.handleEvent = function(e) {
  var keyMap = {};
  keyMap[38] = 0;
  keyMap[39] = 2;
  keyMap[40] = 4;
  keyMap[37] = 6;

  var code = e.keyCode;
  if (code === 32) {
    _.each(Game.enemy, function(enemy) {
      enemy.act();
    });
    _.each(Game.trader, function(trader) {
      trader.act();
    });
  }
  if (!(code in keyMap)) { return; }

  var dir = ROT.DIRS[8][keyMap[code]];
  var newX = this._x + dir[0];
  var newY = this._y + dir[1];
  var newKey = newX + "," + newY;

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
  }
  this._draw();
  this._checkCity();
  this._checkMountain();
  window.removeEventListener("keydown", this);
  Game.engine.unlock();
}

Player.prototype.act = function() {
  Game.engine.lock();
  Game.turnCounter += 1;
  var randNum = Math.floor(Math.random() * 100) + 1;
  console.log(randNum);
  if(Game.turnCounter % 100 === 0) {
    Game._addEnemy();
  } else if(randNum <= 2) {
    Game._addTrader();
  };
  window.addEventListener("keydown", this);
}

Player.prototype._checkCity = function() {
  var key = this._x + "," + this._y;
  var passableCallback = function(x, y) {
    return (x+","+y in Game.map);
  };
  var firstParts = Game.firstCityKey.split(",");
  var firstX = parseInt(firstParts[0]);
  var firstY = parseInt(firstParts[1]);
  var astar = new ROT.Path.AStar(firstX, firstY, passableCallback, {topology: 8});
  var secondParts = Game.secondCityKey.split(",");
  var secondX = parseInt(secondParts[0]);
  var secondY = parseInt(secondParts[1]);
  var cityToCityPath = [];
  var cityPathCallback = function(x, y) {
    cityToCityPath.push([x, y]);
  }
  astar.compute(secondX, secondY, cityPathCallback);

  if (Game.map[key][0] == "C" && Game.map[key][1]['target'] == true) {
    if(Game.map[Game.firstCityKey][1]['target'] == true) {
      Game.map[Game.firstCityKey][1]['target'] = false;
      Game.map[Game.secondCityKey][1]['target'] = true;
    } else if (Game.map[Game.secondCityKey][1]['target'] == true) {
      Game.map[Game.secondCityKey][1]['target'] = false;
      Game.map[Game.firstCityKey][1]['target'] = true;
    };
    Game.score += cityToCityPath.length * 15;
    Game.display.drawText(5, 0, Game.score.toString());
    Game._resetEnemies(Game.enemy.length);
  };
}

Player.prototype._checkMountain = function() {
  var key = this._x + "," + this._y;
  if (Game.map[key][0] == "^") {
    _.each(Game.enemy, function(enemy) {
      enemy.act();
    });
    _.each(Game.trader, function(trader) {
      trader.act();
    });
  };
}

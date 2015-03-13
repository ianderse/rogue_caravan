Game._generateMap = function () {
  this.map = {};
  var takenCells = [];
  var allCells = [];

  var w = 80, h = 25;
  var mapMaker = new ROT.Map.Cellular(w, h, {
    born: [4, 5, 6, 7, 8],
    survive: [2, 3, 4, 5]
  });
  mapMaker.randomize(0.8);

  var cellCallback = function(x, y, value) {
    if (value) {
      var key = x+","+y;
      takenCells.push(key);
      allCells.push(key);
      this.map[key] = Game.Tile.mountainTile;
    } else {
      var key = x+","+y;
      Game.freeCells.push(key);
      allCells.push(key);
      this.map[key] = Game.Tile.grassTile;
    };
  };
  mapMaker.create(cellCallback.bind(this));
  this._setForests(Game.freeCells);
  this._setCities();
  this._drawMap();
  this.player = this._createEntity(Player, Game.freeCells, 3, 10);
  this.enemy = [this._createEntity(Enemy, Game.freeCells)];
  for(var i = 0; i < 3; i++) {
    this.enemy.push(this._createEntity(Enemy, Game.freeCells));
  }
}

Game._drawMap = function() {
  for (var key in this.map) {
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    this.display.draw(x, y, this.map[key].getChar(), this.map[key].getForeground());
  };
}

Game._setCities = function() {
  var y = Math.floor(Math.random() * 24) + 1;
  var x = Math.floor(Math.random() * 2) + 1;
  var key = x+','+y;
  Game.firstCityKey = key;
  this.map[key] = Game.Tile.cityTile;

  var x2 = Math.floor(Math.random() * 2) + 75;
  var y2 = Math.floor(Math.random() * 24) + 1;
  var secondKey = x2+','+y2;
  Game.secondCityKey = secondKey;
  this.map[secondKey] = Game.Tile.cityTileTarget;
}

Game._setForests = function() {
  for (var i = 0; i < 5; i++) {
    var index = Math.floor(ROT.RNG.getUniform() * Game.freeCells.length);
    var key = Game.freeCells.splice(index, 1)[0];
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    var fW = 10, fH = 10;
    var newKey = "0,0";
    var choices = [Game.Tile.grassTile, Game.Tile.forestTile, Game.Tile.forestTile, Game.Tile.forestTile];

    for (var j = 0; j < fW; j++) {
      for (var k = 0; k < fH; k++) {
        y += 1;
        newKey = x+','+y;
        if(this.map[newKey]) {
          this.map[newKey] = choices.random();
        };
      };
      y -= 10;
      x+=1;
      newKey = x+','+y;
      if(this.map[newKey]) {
        this.map[newKey] = choices.random();
      };
    }

    overGrowth(x, y);
  }
}

var overGrowth = function (x, y) {
  while ((Math.floor(ROT.RNG.getUniform() * 50)) > 5) {
    x = [-1, 1].random() + x;
    y = [-1, 1].random() + y;

    if (x >= 79) {
      x = 79;
    } else if (x <= 0) {
      x = 0;
    };

    if (y >= 24) {
      y = 24;
    } else if (y <= 0) {
      y = 0;
    };

    var neighbor = x+','+y;
    if(Game.map[neighbor] != Game.Tile.mountainTile) {
      Game.map[neighbor] = Game.Tile.forestTile;
    };
  };
}

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
      this.map[key] = ["^"];
      this.map[key][1] = {"color": "#4B2803"};
    } else {
      var key = x+","+y;
      Game.freeCells.push(key);
      allCells.push(key);
      this.map[key] = [" "];
      this.map[key][1] = {"color": "#0000"};
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
    if(this.map[key][0] == "^") {
      this.display.draw(x, y, this.map[key][0], this.map[key][1]['color']);
    } else if (this.map[key][0] == "*") {
      this.display.draw(x, y, this.map[key][0], this.map[key][1]['color']);
    } else if (this.map[key][0] == "C") {
      this.display.draw(x, y, this.map[key][0], this.map[key][1]['color']);
    } else if (this.map[key][0] == ' ') {
      this.display.draw(x, y, this.map[key][0]);
    };
  };
}

Game._setCities = function() {
  var y = Math.floor(Math.random() * 24) + 1;
  var x = Math.floor(Math.random() * 2) + 1;
  var key = x+','+y;
  Game.firstCityKey = key;
  this.map[key][0] = "C";
  this.map[key][1] = {"color": "#FFFFFF"};
  x = Math.floor(Math.random() * 2) + 75;
  y = Math.floor(Math.random() * 24) + 1;
  key = x+','+y;
  Game.secondCityKey = key;
  this.map[key][0] = "C";
  this.map[key][1] = {"color": "#FFFFFF"};
  this.map[key][1] = {"target": true};
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
    var choices = [[' ', {"color": "#000"}], ['*', {"color": "#013220"}], ['*', {"color": "#013220"}], ['*', {"color": "#013220"}]];

    for (var j = 0; j < fW; j++) {
      for (var k = 0; k < fH; k++) {
        y += 1;
        newKey = x+','+y;
        randomChoice = choices.random();
        if(this.map[newKey]) {
          this.map[newKey][0] = randomChoice[0];
          this.map[newKey][1] = randomChoice[1];
        };
      };
      y -= 10;
      x+=1;
      newKey = x+','+y;
      randomChoice = choices.random();
      if(this.map[newKey]) {
        this.map[newKey][0] = randomChoice[0];
        this.map[newKey][1] = randomChoice[1];
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
    if(Game.map[neighbor][0] != "^") {
      Game.map[neighbor][0] = "*";
      Game.map[neighbor][1]['color'] = "#013220";
    };
  };
}

Game.map = {};
Game._generateMap = function () {
  var freeCells = [];
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
      this.map[key][1] = "#4B2803";
    } else {
      var key = x+","+y;
      freeCells.push(key);
      allCells.push(key);
      this.map[key] = [" "];
      this.map[key][1] = "#0000";
    };
  };
  mapMaker.create(cellCallback.bind(this));
  this._setForests(freeCells);
  this._setCities();
  this._drawMap();
  this._createPlayer(freeCells);
}

Game._drawMap = function() {
  for (var key in this.map) {
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    if(this.map[key][0] == "^") {
      this.display.draw(x, y, this.map[key][0], this.map[key][1]);
    } else if (this.map[key][0] == "*") {
      this.display.draw(x, y, this.map[key][0], this.map[key][1]);
    } else if (this.map[key][0] == "C") {
      this.display.draw(x, y, this.map[key][0], this.map[key][1]);
    }
  }
}

Game._setCities = function() {
  var y = Math.floor(Math.random() * 24) + 1;
  var x = Math.floor(Math.random() * 2) + 1;
  var key = x+','+y;
  this.map[key][0] = "C";
  this.map[key][1] = "#FFFFFF";
  x = Math.floor(Math.random() * 2) + 75;
  y = Math.floor(Math.random() * 24) + 1;
  key = x+','+y;
  this.map[key][0] = "C";
  this.map[key][1] = "#FFFFFF";
}

Game._setForests = function(freeCells) {
  for (var i = 0; i < 5; i++) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
    var key = freeCells.splice(index, 1)[0];
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    var fW = 10, fH = 10;
    var newKey = "0,0";
    var choices = [[' ', "#000"], ['*', "#013220"], ['*', "#013220"], ['*', "#013220"]];

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
    console.log(neighbor);
    if(Game.map[neighbor][0] != "^") {
      Game.map[neighbor][0] = "*";
      Game.map[neighbor][1] = "#013220";
    };
  };
}

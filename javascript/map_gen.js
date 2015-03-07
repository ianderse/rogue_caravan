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
      this.map[key] = "^";
    }

    var key = x+","+y;
    freeCells.push(key);
    allCells.push(key);
  }
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
    if(this.map[key] == "^") {
      this.display.draw(x, y, this.map[key], "#4B2803");
    } else if (this.map[key] == "*") {
      this.display.draw(x, y, this.map[key], "#013220");
    } else if (this.map[key] == "C") {
      this.display.draw(x, y, this.map[key]);
    }
  }
}

Game._setCities = function() {
  var y = Math.floor(Math.random() * 24) + 1;
  var x = Math.floor(Math.random() * 2) + 1;
  var key = x+','+y;
  this.map[key] = "C";
  x = Math.floor(Math.random() * 2) + 75;
  y = Math.floor(Math.random() * 24) + 1;
  key = x+','+y;
  this.map[key] = "C";
}

Game._setForests = function(freeCells) {
  for (var i = 0; i < 5; i++) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
    var key = freeCells.splice(index, 1)[0];
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);

    var fW = 10, fH = 10;
    var newKey = "";
    var choices = [' ', '*', '*', '*'];

    for (var j = 0; j < fW; j++) {
      y -= k;
      for (var k = 0; k < fH; k++) {
        y += 1;
        newKey = x+','+y;

        this.map[newKey] = choices.random();;
      }
      x+=1;
      newKey = x+','+y;
      this.map[newKey] = choices.random();
    }

    overGrowth(x, y);
  }
}

var overGrowth = function (x, y) {
  while ((Math.floor(ROT.RNG.getUniform() * 50)) > 5) {
    x = [-1, 1].random() + x;
    y = [-1, 1].random() + y;
    console.log(x,y);
    var neighbor = x+','+y;
    if(Game.map[neighbor] != "^") {
      Game.map[neighbor] = "*"
    };
  };
}

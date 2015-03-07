var Game = {
  display: null,

  init: function() {
    this.display = new ROT.Display();
    document.body.appendChild(this.display.getContainer());
    this._generateMap();
  }
}

Game.map = {};
Game._generateMap = function () {
  var w = 100, h = 60;
  this.map = new ROT.Map.Cellular(w, h, {
    born: [4, 5, 6, 7, 8],
    survive: [2, 3, 4, 5]
  });
  this.map.randomize(0.8);
  this._drawMap();
}

Game._drawMap = function() {
  this.map.create(this.display.DEBUG);
}

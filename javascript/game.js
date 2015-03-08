var Game = {
  display: null,
  player: null,
  engine: null,

  init: function() {
    this.display = new ROT.Display();
    this.display.setOptions({
      fontSize: 22,
      fontStyle: "bold",
      bg: "#44783E"
    });
    document.body.appendChild(this.display.getContainer());
    this._generateMap();

    var scheduler = new ROT.Scheduler.Simple();
    scheduler.add(this.player, true);
    scheduler.add(this.player, true);
    scheduler.add(this.enemy, true);

    this.engine = new ROT.Engine(scheduler);
    this.engine.start();
  }
}

Game._createEntity = function(what, freeCells) {
  var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
  var key = freeCells.splice(index, 1)[0];
  var parts = key.split(",");
  var x = parseInt(parts[0]);
  var y = parseInt(parts[1]);
  return new what(x, y);
}

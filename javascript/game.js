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

    this.engine = new ROT.Engine(scheduler);
    this.engine.start();

  }
}

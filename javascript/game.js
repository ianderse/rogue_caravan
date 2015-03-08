var Game = {
  display: null,
  currentScreen: null,
  player: null,
  engine: null,
  gameOver: false,
  score: 0,

  init: function() {
    this.display = new ROT.Display();
    this.display.setOptions({
      fontSize: 22,
      fontStyle: "bold",
      bg: "#44783E"
    });

    var game = this;
    var bindEventToScreen = function(event) {
      window.addEventListener(event, function(e) {
        if (game.currentScreen !== null) {
          game.currentScreen.handleInput(event, e);
        }
      });
    }
    bindEventToScreen('keydown');
    bindEventToScreen('keyup');
    bindEventToScreen('keypress');

    document.body.appendChild(this.display.getContainer());
    Game.switchScreen(Game.Screen.startScreen);
  },

  getDisplay: function() {
    return this.display;
  },

  switchScreen: function(screen) {
    if (this.currentScreen !== null) {
      this.currentScreen.exit();
    };
    this.getDisplay().clear();

    this.currentScreen = screen;
    if (!this.currentScreen !== null) {
        this.currentScreen.enter();
        this.currentScreen.render(this.display);
    };
  }
}

Game._createEntity = function(what, freeCells, x, y) {
  var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
  var key = freeCells.splice(index, 1)[0];
  var parts = key.split(",");
  if (!x) {
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
  }
  return new what(x, y);
}

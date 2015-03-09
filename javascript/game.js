var Game = {
  display: null,
  currentScreen: null,
  player: null,
  engine: null,
  gameOver: false,
  score: 0,
  firstCityKey: null,
  secondCityKey: null,
  turnCounter: 0,
  scheduler: new ROT.Scheduler.Speed(),

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
  if (!x) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
    var key = freeCells.splice(index, 1)[0];
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
  }
  freeCells = _.without(freeCells, _.findWhere(freeCells, x+','+y));
  return new what(x, y);
}

Game._addEnemy = function() {
  var topOrBottom = [1, 24].random();
  var leftOrRight = [1, 79].random();
  console.log('test');
  this.enemy.push(this._createEntity(Enemy, [], leftOrRight, topOrBottom));
  var enemy = _.last(this.enemy);
  Game.scheduler.add(enemy, true);
  enemy._draw();
}

Game._reset = function() {
  Game.gameOver = false;
  Game.scheduler.clear();
  Game.display.clear();
  Game.enemy = null;
  Game.map = null;
  Game.player = null;
  Game.score = 0;
  Game.turnCounter = 0;
}

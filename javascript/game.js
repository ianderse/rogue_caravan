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
  pointCounter: 0,
  scheduler: new ROT.Scheduler.Speed(),
  freeCells: [],
  trader: [],

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
  var y = [1, 24, 12].random();
  var x = [1, 79, 40].random();
  this.enemy.push(this._createEntity(Enemy, [], x, y));
  var enemy = _.last(this.enemy);
  Game.scheduler.add(enemy, true);
  enemy._draw();
}

Game._addTrader = function() {
  var whichCity = [Game.firstCityKey, Game.secondCityKey].random();
  var parts = whichCity.split(",");
  var x = parseInt(parts[0]);
  var y = parseInt(parts[1]);
  Game.trader.push(this._createEntity(Trader, Game.freeCells, x, y));
  var trader = _.last(Game.trader);
  trader.startCity = whichCity;
  Game.scheduler.add(trader, true);
  trader._draw();
}

Game._resetEnemies = function(num) {
  _.each(Game.enemy, function(enemy) {
    enemy.removeEnemy();
  });

  Game.enemy = [];
  for(var i = 0; i < num; i++) {
    this.enemy.push(this._createEntity(Enemy, Game.freeCells));
  };

  Game._drawMap();

  _.each(Game.enemy, function(enemy) {
    Game.scheduler.add(enemy, true);
    enemy._draw();
  });
}

Game._reset = function() {
  Game.gameOver = false;
  Game.scheduler.clear();
  Game.display.clear();
  Game.enemy = [];
  Game.trader = [];
  Game.map = null;
  Game.player = null;
  Game.score = 0;
  Game.turnCounter = 0;
  Game.pointCounter = 0;
  Game.freeCells = [];
}

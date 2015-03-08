Game.Screen = {};

Game.Screen.startScreen = {
  enter: function() {    console.log("Entered start screen."); },
  exit: function() { console.log("Exited start screen."); },
  render: function(display) {
    // Render our prompt to the screen
    display.drawText(27,10, "%c{yellow}Rogue Caravan");
    display.drawText(27,11, "Press [Enter] to start!");
  },
  handleInput: function(inputType, inputData) {
    if (inputType === 'keydown') {
      if (inputData.keyCode === ROT.VK_RETURN) {
        Game.switchScreen(Game.Screen.playScreen);
      }
    }
  }
}

Game.Screen.playScreen = {
  enter: function() {    console.log("Entered play screen."); },
  exit: function() { console.log("Exited play screen."); },
  render: function(display) {
    Game._generateMap();

    var scheduler = new ROT.Scheduler.Speed();
    scheduler.add(Game.player, true);
    _.each(Game.enemy, function(enemy) {
      scheduler.add(enemy, true);
    });

    Game.engine = new ROT.Engine(scheduler);
    Game.engine.start();
  },
  handleInput: function(inputType, inputData) {
    if(Game.gameOver == true) {
      Game.switchScreen(Game.Screen.gameOverScreen);
    }
  }
}

Game.Screen.gameOverScreen = {
  enter: function() {    console.log("Entered lose screen."); },
  exit: function() { console.log("Exited lose screen."); },
  render: function(display) {
    // Render our prompt to the screen
    for (var i = 0; i < 22; i++) {
      display.drawText(2, i + 1, "%b{red}You lose! :(");
    }
  },
  handleInput: function(inputType, inputData) {
  }
}

Game.Screen = {};

Game.Screen.startScreen = {
  enter: function() {    console.log("Entered start screen."); },
  exit: function() { console.log("Exited start screen."); },
  render: function(display) {
    display.drawText(32,5, "%c{yellow}Rogue Caravan");
    display.drawText(10,7, "%c{red}B%c{white}: Bandits. If they catch you, game over.");
    display.drawText(10,9, "%c{#4B2803}^%c{white}: Mountains. When Bandits cross mountains, they are slowed by half, but when you move through them allow bandits to move twice.", 60);
    display.drawText(10,13, "%c{yellow}@%c{white}: You are a trader. Move back and forth between cities and avoid getting caught! By default you move twice as fast as bandits.", 60);
    display.drawText(10,17, "%c{#013220}*%c{white}: Forest. Bandits cannot see you when you are in a forest unless within 5 tiles of you.", 60);
    display.drawText(27,20, "Press [Enter] to start!");
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

    Game.scheduler.add(Game.player, true);
    _.each(Game.enemy, function(enemy) {
      Game.scheduler.add(enemy, true);
    });

    Game.engine = new ROT.Engine(Game.scheduler);
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
    for (var i = 0; i < 22; i++) {
      display.drawText(2, i + 1, "%b{red}You lose! :(");
    }
  },
  handleInput: function(inputType, inputData) {
  }
}

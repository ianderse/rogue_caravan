Game.Screen = {};

Game.Screen.startScreen = {
  enter: function() {},
  exit: function() {},
  render: function(display) {
    display.drawText(32,1, "%c{yellow}Rogue Caravan", 45);
    display.drawText(0,3,"%c{blue}T%c{white}: Traders. They will move between cities and distract the bandits.", 45);
    display.drawText(0,6, "%c{red}B%c{white}: Bandits. If they catch you, game over.", 45);
    display.drawText(0,8, "%c{#4B2803}^%c{white}: Mountains. When Bandits cross mountains, they are slowed by half, but when you move through them the bandits move twice.", 45);
    display.drawText(0,12, "%c{yellow}@%c{white}: You are a trader.  Avoid getting caught by bandits! By default you move twice as fast as bandits.", 45);
    display.drawText(0,16, "%c{#013220}*%c{white}: Forest. Bandits cannot see you when you are in a forest unless within 5 tiles of you.", 45);
    display.drawText(0,19, "%c{white}C: City. Start by heading to the city at the right, then move back and forth between cities to gain points.", 45);
    display.drawText(58,3, "%c{yellow}Controls");
    display.drawText(50,5, "%c{white}Arrow Keys to move, space to wait.");
    display.drawText(58,7, "%c{yellow}Scoring");
    display.drawText(50,9, "%c{white}The quicker you make it to the city, and the further apart the cities, the more points you get.", 28);
    display.drawText(27,23, "Press [Enter] to start!");
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
  enter: function() {},
  exit: function() {},
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
  enter: function() {},
  exit: function() {
    Game._reset();
  },
  render: function(display) {
    display.drawText(32, 5, "%b{red}The Bandits caught you!");
    display.drawText(35, 7, "Final score: ");
    display.drawText(48, 7, Game.score.toString());
    display.drawText(27,20, "Press [Enter] to play again!");
  },
  handleInput: function(inputType, inputData) {
    if (inputType === 'keydown') {
      if (inputData.keyCode === ROT.VK_RETURN) {
        Game.switchScreen(Game.Screen.startScreen);
      }
    }
  }
}

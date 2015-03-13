Game.Tile = function(properties) {
  properties = properties || {};
  Game.Glyph.call(this, properties);
  this._target = properties['target'] || false;
};

Game.Tile.extend(Game.Glyph);

Game.Tile.prototype.isTarget = function() {
  return this._target;
}

Game.Tile.grassTile    = new Game.Tile({"character": ' '});
Game.Tile.forestTile   = new Game.Tile({"character": "*", "foreground": "#013220"});
Game.Tile.mountainTile = new Game.Tile({"character": "^", "foreground": "#4B2803"});
Game.Tile.cityTile     = new Game.Tile({"character": "C", "foreground": "white"});
Game.Tile.cityTileTarget = new Game.Tile({"character": "C", "foreground": "white", "target": true})

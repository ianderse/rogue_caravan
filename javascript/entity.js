var checkTerrain = function (entity) {
  if(Game.map[entity._x+","+entity._y] == Game.Tile.mountainTile) {
    entity.speed = 25;
  } else if(Game.map[entity._x+","+entity._y] == Game.Tile.grassTile) {
    entity.speed = 50;
  } else if(Game.map[entity._x+","+entity._y] == Game.Tile.forestTile) {
    entity.speed = 33;
  };
};

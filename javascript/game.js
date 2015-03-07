var Game = {
  display: null,

  init: function() {
    this.display = new ROT.Display();
    this.display.setOptions({
      fontSize: 22,
      fontStyle: "bold",
      bg: "#44783E"
    });
    document.body.appendChild(this.display.getContainer());
    this._generateMap();
  }
}

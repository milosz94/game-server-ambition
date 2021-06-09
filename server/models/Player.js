var shortID = require('shortid');
var Vector3 = require('./Vector3.js');

module.exports = class Player {
  constructor()
  {
      this.username = "";
      this.id = shortID.generate();
      this.position = new Vector3();
  }

    toJson()
    {
        var player = {
            "username" : this.username,
            "id" : this.id,
            "position" : this.position.toJavaScriptObject()
        };
        return JSON.stringify(player);
    }
    toJavaScriptObject()
    {
        var player = {
            "username" : this.username,
            "id" : this.id,
            "position" : this.position.toJavaScriptObject()
        };
        return player;
    }

};
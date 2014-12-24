var secrets = require('../config/secrets');

exports.getGenerate = function(req, res) {
  res.render('generate', {
    title: 'Generate ID'
  });
};

exports.generateID = function(req, res) {
  res.render('generated', {
    title: 'Generate ID',
    uniqueID: randomID()
  });
};

function randomID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i=0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
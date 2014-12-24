var secrets = require('../config/secrets');

exports.getViewer = function(req, res) {
  res.render('viewer', {
    title: 'Data Viewer'
  });
};

exports.postData = function(req, res) {
  
  // TODO: Output the body of the Postmark email (POST) here.
  console.log(req.body);  
};

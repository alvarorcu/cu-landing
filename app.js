var express = require('express'),
    swig = require('swig');
var app = express();
var sys = require('sys'),
    mail = require('./public/libEmail').Mail({
      host: 'smtp.zoho.com',
      port: 587,
      username: 'dev@hackspace.pe',
      password: 'hackspace'
    });

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');

app.use(express.static('./public'));

app.get('/', function(req, res){
    res.render('index');
});

app.get('/send',function(req,res){

        mail.message({
	    from: 'dev@hackspace.pe',
	    to: ['dev@hackspace.pe'],
	    subject: 'Core Upgrade 2015'
	  })
	  .body('\r\n De: ' + req.query.fromwho + '\r\n Correo: ' + req.query.subject + '\r\n Mensaje: '+ req.query.text)
	  .send(function(err) {
	    if (err) throw err;
            res.end("sent");
	    sys.debug('Message sent!');
	  });
});

var port = 3000;
var server = app.listen(port, function () {
    console.log('server listening on port ' + port);
});

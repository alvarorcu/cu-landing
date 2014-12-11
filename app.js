var express = require('express'),
    swig = require('swig');
var app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');

app.use(express.static('./public'));

app.get('/', function(req, res){
    res.render('index');
});

var port = 3000;
var server = app.listen(port, function () {
    console.log('server listening on port ' + port);
});


var express = require("express")
  , routes = require("./routes")
  , user = require("./routes/user")
  , http = require("http")
  , path = require("path")
  , redisClient = require("redis").createClient()
  , app = express()
  , twitterWorker = require("./twitter.js")
  , trackedWords = ["bleak", "leery"];

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//app.get('/', routes.index);
//app.get('/users', user.list);
app.get("/", function (req, res) {
  var response = "hello there";
  //res.send("hi");
  res.send(response);
});

app.get("/goodbye", function (req, res) {
  //send "Goodbye World" to the client as html
  res.send("Goodbye World!");
});

app.get("/login", function (req, res) {
  res.send("You need to login!");
});

app.get("/counts.json", function	(req, res) {
    redisClient.mget(["bleak", "leery"], function	(error, results) {
	if (error !== null) {
            // handle error here                                                                                                                       
            console.log("ERROR: " + error);
        } else {
            var jsonObject = {
		            "fake":results[0],
                "leery":results[1]
            };
            // use res.json to return JSON objects instead of strings
            res.json(jsonObject);
        }
    });
});
// app.get("todos.json", function (req,res) {
// client.mget....
// var response = "{'key':'value'}";
// res.writehead(200, {"Content-Type": "application/json"});
//////////////////////////////////////////
// app.get("counts.json", function (req,res) {
  // redisClient.mget... 
// client.mget....
// var response = "{'key':'value'}";
// res.writehead(200, {"Content-Type": "application/json"});
twitterWorker(trackedWords);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


var express = require("express")
    , routes = require("./routes")
    , user = require("./routes/user")
    , http = require("http")
    , path = require("path")
    , redisClient = require("redis").createClient()
    , app = express()
    , twitterWorker = require("./twitter.js")
    , trackedWords = ["good", "bad", "yeah", "no", "could", "should", "thanks", "sorry"];
    // symmetry - for each happy word, please follow with opposite sad word
    
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

app.get("/counts.json", function(req, res) {
    var happyCount = 0;
    var sadCount = 0;
    redisClient.mget(trackedWords, function(error, results) {
        var jsonObject = [];
        var i;
	      if (error !== null) {
              // handle error here                                                                                                                       
              console.log("ERROR: " + error);
        }
        else {
            for (i = 0; i < trackedWords.length; i = i + 1) {
                if (i%2 === 0){
                    jsonObject.push( {
                        "happyKey": trackedWords[i],
    		                "count":results[i],
                    });
                    happyCount = happyCount + parseInt(results[i], 10);
                }
                else {
                    jsonObject.push( {
                        "sadKey": trackedWords[i],
    		                "count":results[i],
                    });
                    sadCount = sadCount + parseInt(results[i], 10);
                }
            }
            jsonObject.push( {"happyCount":happyCount, "sadCount":sadCount} );
            res.json(jsonObject);
        }
    });
});

twitterWorker(trackedWords);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

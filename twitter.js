var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');

var http = require("http");
//create redis client                                                                                                                                                                                                                       
var client = redis.createClient();



var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

t.stream(
    'statuses/filter',
    { track: [ 'shouldnt', 'cant' ] }, // 'awesome', 'cool', 'rad', 'gnarly', 'groovy'] },
    function(stream) {
        stream.on('data', function(tweet) {
            console.log(tweet.text);
            //if awesome is in the tweet text, increment the counter                                                                                                                                                                        
            if(tweet.text.match(/shouldnt/)) { //if (tweet.text.indexOf("awesome") > -1)
                client.incr('shouldnt');
            }
            if(tweet.text.indexOf("cant") > -1) { //regular expression .match may be better
              client.incr("cant");
            }
        });
    }
);

var numberOfServerHits = 0;
http.createServer(function (req, res) {
    var response = "";
    client.mget(["shouldnt", "cant"], function (error, resultCounts) {  //switched get to mget
        if (error !== null) {
            //handle error here
            console.log("error: " + error);
        } else {
          numberOfServerHits = numberOfServerHits + 1;
            res.writeHead(200, {"Content-Type": "text/plain"}); //  text/html ...
            // response = "<html>";
            // response = "<html>";
            response += "this is the first line...\n";
            response += "this server has been hit " + numberOfServerHits + " times...\n";
            response += "there were recently " +resultCounts[0] + " bummed out -shouldnt- words...\n"
            response += "The sad -cant- count is " + resultCounts[1];
            // response = "</html>";
            res.end(response);
        }
    });
}).listen(3000);
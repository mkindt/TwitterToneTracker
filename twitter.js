var worker = function (words) {
    var twitter = require("ntwitter");
    var redis = require("redis");
    var credentials = require("./credentials.js");                                                                                                                                                                                                                     
    var client = redis.createClient();
    //console.log(words);
    
    
    var t = new twitter({
        consumer_key: credentials.consumer_key,
        consumer_secret: credentials.consumer_secret,
        access_token_key: credentials.access_token_key,
        access_token_secret: credentials.access_token_secret
    });
    
    t.stream(
        "statuses/filter",
        { track: words }, // 'awesome', 'cool', 'rad', 'gnarly', 'groovy'] },
        function(stream) {
            stream.on('data', function(tweet) {
                console.log(tweet.text);
                words.forEach(function(word) {
                    if (tweet.text.indexOf(word) > -1) { 
                        client.incr(word);
                        console.log("indexOF");
                        console.log(word); 
                    }
                    if (tweet.text.match(word) > -1) { 
                        client.incr(word);
                        console.log("match");
                        console.log(word);
                    }
                });
            });
                /*if awesome is in the tweet text, increment the counter                                                                                                                                                                        
                if(tweet.text.match(/shouldnt/)) { //if (tweet.text.indexOf("awesome") > -1)
                    client.incr('shouldnt');
                }
                if(tweet.text.indexOf("cant") > -1) { //regular expression .match may be better
                  client.incr("cant");
                } */
        }
    );
};

module.exports = worker;

var main = function () {
    $.getJSON("/counts.json", function (response){
        response.forEach(function(result) {
            if (result.happyKey) {
                $(".happy").append("<p>" + result.happyKey + " : " + result.count + "</p>");
            }
            else if (result.sadKey) {
                $(".sad").append("<p>" + result.sadKey + " : " + result.count + "</p>");
            }
            else if (result.happyCount) {
                $(".happy").append("<h4> Total : " + result.happyCount + "</h4>");
                $(".sad").append("<h4> Total : " + result.sadCount + "</h4>");
                $("#tracker").append("<div id='vibe'><h1> Adjusting to Worldly Vibe...</h1></div>");
                $("#vibe").animate( {fontSize: "1.5em"}, 2500, function(){
                    if  (result.happyCount < result.sadCount ){
                        $("body").css("font-family", "Eater");
                        $("#vibe").replaceWith("<h1>Vibe is bad...</h1>");
                    }
                    else {
                        $("body").css("font-family", "Emilys Candy");
                        $("#vibe").replaceWith("<h1>Vibe is good!</h1>");
                    }  
                });
            }
        });
    });
};

$(document).ready(main);
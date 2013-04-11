var main = function () {
  $.getJSON("/counts.json", function (response){
    response.forEach(function(result) {
      if (result.key) {
        $("body").append("<p>" + result.key + " : " + result.count + "</p>");
      }
    });
  });
};

$(document).ready(main);
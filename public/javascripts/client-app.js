var main = function () {
  $.getJSON("/counts.json", function (response){
    $("body").append("<p>shouldnt: "+ response.shouldnt + "</p>");
    $("body").append("<p>cant: "+ response.cant + "</p>");
  });
};

$(document).ready(main);
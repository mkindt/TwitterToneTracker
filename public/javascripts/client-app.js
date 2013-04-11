var main = function () {
  $.getJSON("/counts.json", function (response){
    $("body").append("<p>leery: "+ response.leery + "</p>");
    $("body").append("<p>bleak: "+ response.bleak + "</p>");
  });
};

$(document).ready(main);
var main = function () {
  $.getJSON("/counts.json", function (response){
    $("body").append("<p>awesome:"+ response)
  }) 
}
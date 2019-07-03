$(document).ready(function() {

  (function theLoop (i) {
    setTimeout(function () {
      $('li.ruse-brute').each(function(i){brute($(this))})
      // DO SOMETHING WITH data AND stuff
      if (--i) {                  // If i > 0, keep going
        theLoop(i);  // Call the loop again
      }
    }, 300);
  })(100000000);

});

function brute(li) {

  (function theLoop (i) {
    setTimeout(function () {

      if(li.index() === 0 && li.text() === "R"){li.removeCLass("ruse-brute")}
      else if(li.index() === 1 && li.text() === "U"){li.removeCLass("ruse-brute")}
      else if(li.index() === 2 && li.text() === "S"){li.removeCLass("ruse-brute")}
      else if(li.index() === 3 && li.text() === "E"){li.removeCLass("ruse-brute")}
      else{ li.text(randomChar())}

      // DO SOMETHING WITH data AND stuff
      if (--i) {                  // If i > 0, keep going
        theLoop(i);  // Call the loop again
      }
    }, 1);
  })(1);


}
function randomChar(){
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1).toUpperCase();
}

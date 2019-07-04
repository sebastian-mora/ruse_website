$(document).ready(function() {

  guessPassword()



});



function guessPassword(){



    (function theLoop (i) {
      setTimeout(function () {
        $('li.ruse-brute').each(function(i){brute($(this))})
        // DO SOMETHING WITH data AND stuff
        if (--i) {                  // If i > 0, keep going
          theLoop(i);  // Call the loop again
          console.log("call");
        }
        else{
          cracked()
        }
      }, 50);
    })(100);

}


function brute(li) {

  (function theLoop (i) {
    setTimeout(function () {
      if(li.index() === 0 && li.text() === "R"){li.removeClass("ruse-brute")}
      else if(li.index() === 1 && li.text() === "U"){li.removeClass("ruse-brute")}
      else if(li.index() === 2 && li.text() === "S"){li.removeClass("ruse-brute")}
      else if(li.index() === 3 && li.text() === "E"){li.removeClass("ruse-brute")}
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

function cracked(){
  $('#root').text("root#")
}

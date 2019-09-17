$(document).ready(function() {
  //IF YOU KNOW JS PLS FIX THIS MESS LMAO
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
          //cracked()
        }
      }, 80);
    })(26);
}


function brute(li) {

  (function theLoop (i) {
    setTimeout(function () {
      if(li.index() === 0 && li.text() === "R"){li.removeClass("ruse-brute")}
      else if(li.index() === 1 && li.text() === "U"){li.removeClass("ruse-brute")}
      else if(li.index() === 2 && li.text() === "S"){li.removeClass("ruse-brute")}
      else if(li.index() === 3 && li.text() === "E"){li.removeClass("ruse-brute")}
      else{ var char = li.text(); li.text(nextChar(char))}
      // DO SOMETHING WITH data AND stuff
      if (--i) {                  // If i > 0, keep going
        theLoop(i);  // Call the loop again
      }
    }, 1);
  })(1);

}

function nextChar(currentChar){
  var char_code = currentChar.charCodeAt(0)
  char_code = char_code + 1
  if(char_code >= 90){return 'A'}
  return String.fromCharCode(char_code)
}

function cracked(){
  $('#root').text("root#")
}

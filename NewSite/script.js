var image = [];
var i;
var counter = 0;
var type = ".jpg";
var slideTime = 3000;
var buttonPressActive = false;
imageAmount = 9;

function switchImage() {
    buttonPressActive = true;
    counter = (counter + 1)%(imageAmount);
    console.log(counter);
    document.getElementById("image").src=image[counter];
}

function goBackImage(){
  buttonPressActive = true;
  if (counter == 0) {
    counter = image.length-1;
  }
  else {
    counter = (counter-1)%(image.length);
  }
  console.log(counter);
  document.getElementById("image").src=image[counter];
}

function loopSlide() {
  while(buttonPressActive == false) {
    counter = (counter + 1)%(imageAmount);
    document.getElementById("image").src=image[counter];
    console.log("Loop Slide was called with " + image[counter]);
  }
}

window.onload = function() {
  for (i = 0; i<=imageAmount-1; i++) {
    image[i] = "images/" + i + type;
    console.log("i is " + i);
  }
  setInterval(function(){loopSlide()}, slideTime);
}

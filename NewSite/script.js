var image = [];
var i;
var counter = 0;
var type = ".jpg";
var imageAmount = 8;
var width = 1616/2;
var height = 1080/2;


window.onload = function() {
  for (i = 0; i<=imageAmount; i++) {
    image[i] = "images/" + i + type;
  }
  document.getElementById("image").style="width: " + width + "px; height: " + height + "px;"
}
function switchImage() {
    counter = (counter + 1)%(imageAmount + 1);
    document.getElementById("image").src=image[counter];
    width = width + 10
    document.getElementById("image").style="width: " + width + "px; height: " + height + "px;"
}

function goBackImage(){
  if (counter == 0) {
    counter = imageAmount;
  }
  else {
    counter = (counter-1)%(image.length);
  }
  document.getElementById("image").src=image[counter];
}

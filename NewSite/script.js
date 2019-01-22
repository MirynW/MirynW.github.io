var image = [];
var i;
var counter = 0;
var type = ".jpg";
imageAmount = 11;
window.onload = function() {
  for (i = 1; i<=imageAmount; i++) {
    image[i] = "images/" + i + type;
  }
}
function switchImage() {
    counter = (counter + 1)%(imageAmount);
    if (counter == 0) {
      counter = 1;
    }
    document.getElementById("image").src=image[counter];
}

function goBackImage(){
  if (counter == 0) {
    counter = image.length-1;
  }
  else {
    counter = (counter-1)%(image.length);
  }
  document.getElementById("image").src=image[counter];
}

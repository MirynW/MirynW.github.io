var counter = 0;
var image = ["../images/TrailerIllustrated.jpeg", "../images/OceanPhoto.jpeg", "../images/IpswitchRockPhoto.jpeg"];
var width = 2040/1.79;
var height = 1530/1.79;

window.onload = function() {
  document.getElementById("image").style="width: " + width + "px; height: " + height + "px;"
}

function nextImage(){
  counter = (counter+1)%(image.length);
  document.getElementById("image").src=image[counter];
}

function previousImage(){
  if(counter == 0){
    counter = image.length-1;
  }
  else{
    counter = (counter-1)%(image.length);
  }
  document.getElementById("image").src=image[counter];
}

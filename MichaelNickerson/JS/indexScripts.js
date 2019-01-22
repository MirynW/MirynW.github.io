var counter = 0;
var image = ["images/IpswitchRockPhoto.jpeg","images/OceanPhoto.jpeg","images/TrailerIllustrated.jpeg"];

window.onload = function() {
  setInterval(function(){nextImage();}, 2000);
}

function nextImage() {
  counter = (counter + 1)%(image.length);
  document.jumbotron.backgroundImage="url(image[counter])";
}

function previousImage() {
  if(counter == 0) {
    counter = image.length-1;
  }
  else {
    counter = (counter-1)%(image.length);
  }
  document.jumbotron.backgroundImage="url(image[counter])";
}

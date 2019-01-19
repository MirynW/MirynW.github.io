var image = ["images/IpswitchRockPhoto.jpeg","images/OceanPhoto.jpeg","images/TrailerIllustrated.jpeg"];
var counter = 0;
function switchImage() {
    counter = (counter + 1)%(image.length);
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

const stick = document.querySelector('.stick');
const first = document.querySelector('.stick');
const second = document.querySelector('#fixed');

const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('nav-links li');
    //Toggle nav
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        //Animate Links
        navLinks.forEach((link, index) => {
            if(link.getElementsByClassName.animation) {
                link.getElementsByClassName.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${(index / 7) + 0.3}s`;
            }
        });
        //Burger Animation
        burger.classList.toggle('toggle');
        second.classList.add('fill');
        first.classList.add('fill');
    });
    window.onscroll = function sticky() {
        if(window.pageYOffset > stick.offsetTop) {
            first.classList.add('change-nav');
            console.log("bottom");
        } else {
            first.classList.remove('change-nav');
            console.log("top");
        }
    }
}
var changer;
function changeImage() {
    changer = setInterval(function(){change();}, 4000);
}

var i = 0;
const imageElement = document.querySelector('.effect');
function change() {
    let arr = ['BoatBack.JPG', 'BoatOcean.JPG', 'FrontPicture.jpeg'];
    imageElement.style.backgroundImage = `url('Images/Photography/${arr[i]}')`;
    if(arr[i] === 'FrontPicture.jpeg')
        imageElement.style.backgroundPosition = 'center';
    else
        imageElement.style.backgroundPosition = 'bottom';
    i = (i+1)%(arr.length);
    //i++;
    //if (i > arr.length-1)
        //i = 0;
}

navSlide();
changeImage();

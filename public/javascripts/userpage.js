// global variables
const images = document.querySelectorAll('.carousel__image');

// calculates ideal image sizes then loads them in
function loadImages(images) {
  colWidth =
    parseInt(
      window.getComputedStyle(document.body).getPropertyValue('font-size')
    ) * 16;
  const pixelRatio = window.devicePixelRatio || 1.0;

  let str = `https://res.cloudinary.com/christianjosuebt/image/upload/q_auto,f_auto,fl_lossy,w_${Math.round(
    colWidth * pixelRatio
  )}/coffeeShops`;
  for (let i = 0; i < images.length; i++) {
    images[i].src = `${str}/${images[i].dataset.src}`;
  }
}
// checks if element passed to it is "active" or not. Returns a boolean value
const active = element => element.classList.contains('active');
// changes which image is "active" to the left
function changeIndexLeft(images, top, bottom) {
  let index = 0;
  for (let i = 0; i < images.length; i++) {
    if (active(images[i])) index = i;
  }
  for (let i = 0; i < images.length; i++) {
    if (index === 0 && i === index) {
      images[i].classList.toggle('active');
      top[i].classList.toggle('active');
      bottom[i].classList.toggle('active');
      images[images.length - 1].classList.toggle('active');
      top[images.length - 1].classList.toggle('active');
      bottom[images.length - 1].classList.toggle('active');
    } else if (i === index && index !== 0) {
      images[i].classList.toggle('active');
      top[i].classList.toggle('active');
      bottom[i].classList.toggle('active');
      images[i - 1].classList.toggle('active');
      top[i - 1].classList.toggle('active');
      bottom[i - 1].classList.toggle('active');
    }
  }
}
// changes which image is "active" to the right
function changeIndexRight(images, top, bottom) {
  // coffeeShops.forEach((img, i) => img.style.display = obj.num === i ? 'block' : 'none');
  let index = 0;
  for (let i = 0; i < images.length; i++) {
    if (active(images[i])) index = i;
  }
  for (let i = 0; i < images.length; i++) {
    if (index === images.length - 1 && i === index) {
      images[i].classList.toggle('active');
      images[0].classList.toggle('active');
      top[i].classList.toggle('active');
      top[0].classList.toggle('active');
      bottom[i].classList.toggle('active');
      bottom[0].classList.toggle('active');
    } else if (i === index && index !== images.length - 1) {
      images[i].classList.toggle('active');
      images[i + 1].classList.toggle('active');
      top[i].classList.toggle('active');
      top[i + 1].classList.toggle('active');
      bottom[i].classList.toggle('active');
      bottom[i + 1].classList.toggle('active');
    }
  }
}
// displays hidden left and right buttons
function display(nodelist) {
  for (let i = 0; i < nodelist.length; i++) {
    nodelist[i].classList.remove('hide');
  }
}
// finds all carousel_images and calls the changeIndex functions where and if appropriate
function carousel() {
  const carousels = document.querySelectorAll('.carousel');
  for (let i = 0; i < carousels.length; i++) {
    const images = carousels[i].querySelectorAll('.carousel__image');
    const top = carousels[i].querySelectorAll('.carousel__top');
    const bottom = carousels[i].querySelectorAll('.carousel__bottom');
    if (images.length > 1) {
      changePicture(carousels[i], images, top, bottom);
      const svgs = carousels[i].querySelectorAll('.button--svg');
      display(svgs);
    }
  }
  return;
}
// adds event listeneres to the left and right buttons on images so the user can click on them and
// change the picture being displayed
function changePicture(carousel, images, top, bottom) {
  const rightButton = carousel.querySelector('.button--right');
  rightButton.addEventListener('click', function () {
    changeIndexRight(images, top, bottom);
  });
  const leftButton = carousel.querySelector('.button--left');
  leftButton.addEventListener('click', function () {
    changeIndexLeft(images, top, bottom);
  });
  return;
}

// waiting until everything has loaded to run the function that places cards where they
// should be
document.addEventListener('readystatechange', event => {
  if (document.readyState === 'complete') {
    carousel();
  }
});
loadImages(images);

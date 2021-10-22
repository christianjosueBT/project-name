// global variables
const images = document.querySelectorAll('.carousel__image');

// calculates ideal image sizes then loads them in
function loadImages(images) {
  const colWidth = document.querySelector('.reviews').offsetWidth;
  const colHeight = document.querySelector('.reviews').offsetHeight;
  const pixelRatio = window.devicePixelRatio || 1.0;
  let str = `https://res.cloudinary.com/christianjosuebt/image/upload/q_auto,f_auto,fl_lossy,c_fill,w_${Math.round(
    colWidth * pixelRatio
  )},h_${Math.round(colHeight * pixelRatio)}/coffeeShops`;
  for (let i = 0; i < images.length; i++) {
    images[i].src = `${str}/${images[i].dataset.src}`;
  }
}
// checks if element passed to it is "active" or not. Returns a boolean value
const active = element => element.classList.contains('active');
// changes which image is "active" to the left
function changeIndexLeft(images, texts, top, bottom, stars) {
  let index = 0;
  let items = [];
  if (images.length !== 0) items.push(images);
  if (texts.length !== 0) items.push(texts);
  if (top.length !== 0) items.push(top);
  if (bottom.length !== 0) items.push(bottom);
  if (stars.length !== 0) items.push(stars);

  for (let i = 0; i < items[0].length; i++) {
    if (active(items[0][i])) {
      index = i;
      break;
    }
  }
  for (let i = 0; i < items[0].length; i++) {
    if (index === 0 && i === index) {
      for (let j = 0; j < items.length; j++) {
        items[j][i].classList.toggle('active');
        items[j][items[0].length - 1].classList.toggle('active');
      }
    } else if (i === index && index !== 0) {
      for (let j = 0; j < items.length; j++) {
        items[j][i].classList.toggle('active');
        items[j][i - 1].classList.toggle('active');
      }
    }
  }
}
// changes which image is "active" to the right
function changeIndexRight(images, texts, top, bottom, stars) {
  // coffeeShops.forEach((img, i) => img.style.display = obj.num === i ? 'block' : 'none');

  let index = 0;
  let items = [];
  if (images.length !== 0) items.push(images);
  if (texts.length !== 0) items.push(texts);
  if (top.length !== 0) items.push(top);
  if (bottom.length !== 0) items.push(bottom);
  if (stars.length !== 0) items.push(stars);

  for (let i = 0; i < items[0].length; i++) {
    if (active(items[0][i])) {
      index = i;
      break;
    }
  }
  for (let i = 0; i < items[0].length; i++) {
    if (index === items[0].length - 1 && i === index) {
      for (let j = 0; j < items.length; j++) {
        items[j][i].classList.toggle('active');
        items[j][0].classList.toggle('active');
      }
    } else if (i === index && index !== items[0].length - 1) {
      for (let j = 0; j < items.length; j++) {
        items[j][i].classList.toggle('active');
        items[j][i + 1].classList.toggle('active');
      }
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
    const texts = carousels[i].querySelectorAll('.carousel__text');
    const top = carousels[i].querySelectorAll('.carousel__top');
    const bottom = carousels[i].querySelectorAll('.carousel__bottom');
    const stars = carousels[i].querySelectorAll('.stars--parent');
    if (
      images.length > 1 ||
      texts.length > 1 ||
      top.length > 1 ||
      bottom.length > 1 ||
      images.length > 1
    ) {
      changePicture(carousels[i], images, texts, top, bottom, stars);
      const svgs = carousels[i].querySelectorAll('.button--svg');
      if (svgs.length !== 0) display(svgs);
    }
  }

  const linked = document.querySelectorAll('.carousel--linked');
  let images = [];
  let texts = [];
  let top = [];
  let bottom = [];
  let stars = [];
  if (linked.length > 1) {
    for (let i = 0; i < linked.length; i++) {
      images.push.apply(
        images,
        Array.from(linked[i].querySelectorAll('.carousel__image'))
      );
      texts.push.apply(
        texts,
        Array.from(linked[i].querySelectorAll('.carousel__text'))
      );
      top.push.apply(
        top,
        Array.from(linked[i].querySelectorAll('.carousel__top'))
      );
      bottom.push.apply(
        bottom,
        Array.from(linked[i].querySelectorAll('.carousel__bottom'))
      );
      stars.push.apply(
        stars,
        Array.from(linked[i].querySelectorAll('.stars--parent'))
      );
    }
  }
  if (
    images.length > 1 ||
    texts.length > 1 ||
    top.length > 1 ||
    bottom.length > 1 ||
    images.length > 1
  ) {
    changePictures(linked, images, texts, top, bottom, stars);
    for (let i = 0; i < linked.length; i++) {
      const svgs = linked[i].querySelectorAll('.button--svg');
      if (svgs.length !== 0) display(svgs);
    }
  }
  return;
}
// adds event listeneres to the left and right buttons on images so the user can click on them and
// change the picture being displayed
function changePicture(c, images, texts, top, bottom, stars) {
  const rightButton = c.querySelector('.button--right');
  if (rightButton) {
    rightButton.addEventListener('click', function () {
      changeIndexRight(images, texts, top, bottom, stars);
    });
  }
  const leftButton = c.querySelector('.button--left');
  if (leftButton) {
    leftButton.addEventListener('click', function () {
      changeIndexLeft(images, texts, top, bottom, stars);
    });
  }
  return;
}

// adds event listeneres to the left and right buttons on images so the user can click on them and
// change the picture being displayed
function changePictures(linked, images, texts, top, bottom, stars) {
  for (let i = 0; i < linked.length; i++) {
    const rightButton = linked[i].querySelector('.button--right');
    if (rightButton) {
      rightButton.addEventListener('click', function () {
        changeIndexRight(images, texts, top, bottom, stars);
      });
    }
    const leftButton = linked[i].querySelector('.button--left');
    if (leftButton) {
      leftButton.addEventListener('click', function () {
        changeIndexLeft(images, texts, top, bottom, stars);
      });
    }
  }
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

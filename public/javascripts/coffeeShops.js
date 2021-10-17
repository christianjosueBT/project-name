// global variables
const controller = new AbortController();
const heights = [];
const images = document.querySelectorAll('.carousel__image');
const footer = document.querySelector('footer');
const container100 = document.querySelector('.container--100');
let blocks = document.querySelectorAll('.card');
let margin = 0;
let windowWidth = 0;
let colWidth = 0;
let cardsSpace = 0;
let colCount = 0;
let whiteSpace = 0;
let min = 0;
let index = 0;
let count = 0;
let user = {};

let options = {
  root: null,
  rootMargins: '0px',
  threshold: 0.5,
};

function handleIntersect(entries) {
  if (entries[0].isIntersecting) {
    getData();
  }
}

function getData() {
  count++;
  colWidth = blocks[0].clientWidth;
  let str = window.location.href.includes('?')
    ? `${window.location.href}&count=${count}`
    : `/coffeeShops?count=${count}`;

  fetch(str)
    .then(res => res.json())
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
        let card = document.createElement('div');
        let card__image = document.createElement('div');
        let card__body = document.createElement('div');
        let h3 = document.createElement('h3');
        let h3__a = document.createElement('a');
        let p = document.createElement('p');
        let svgLeft = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg'
        );
        let useLeft = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'use'
        );
        let svgRight = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg'
        );
        let useRight = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'use'
        );

        useLeft.setAttribute('href', '#svg--left');
        useRight.setAttribute('href', '#svg--right');
        svgLeft.setAttribute('class', 'button--svg button--left hide');
        svgRight.setAttribute('class', 'button--svg button--right hide');
        svgLeft.appendChild(useLeft);
        svgRight.appendChild(useRight);

        card.className = 'card';
        card__image.className = 'card__image carousel';
        card__body.className = 'card__body';

        h3.innerHTML = data[i].name;
        h3__a.setAttribute('href', `/coffeeShops/${data[i]._id}`);
        p.innerHTML = data[i].description;

        card__image.appendChild(svgLeft);
        card__image.appendChild(svgRight);
        card__body.appendChild(h3);
        card__body.appendChild(p);

        card.appendChild(card__image);
        card.appendChild(card__body);

        container100.appendChild(card);
        setImages(card__image, data[i].images, colWidth);
        if (data[i].images.length > 1) {
          display([svgLeft, svgRight]);
        }
      }
    })
    .catch(error => console.log(error));
  return;
}

// function that places cards where they should be to get a pinterest like layout
function setupBlocks() {
  blocks = document.querySelectorAll('.card');
  // getting window width, width of a card, and setting the margin to be equal to one rem
  windowWidth = window.innerWidth;
  colWidth = blocks[0].clientWidth;
  margin = parseInt(
    window.getComputedStyle(document.body).getPropertyValue('font-size')
  );
  // calculating how many cards fit in a "row" of the viewport
  colCount = Math.floor(windowWidth / (colWidth + margin));
  // calculating the space the cards will take (including the margin I want between them as well as the
  // minimum margin between the cards and the left and right side of the page)
  cardsSpace = colCount * (colWidth + margin);
  // calculating the whitespace that will remain
  whiteSpace = windowWidth - cardsSpace;
  // only placing the cards that fit in the first row in their appropriate places
  if (blocks.length >= colCount) {
    for (let i = 0; i < colCount; i++) {
      // I want the white space to be divided evenly on the left and right side of the page
      blocks[i].style.left = `${
        (whiteSpace + margin) / 2 + (colWidth + margin) * i
      }px`;
      // placing the cards at the top of their container and letting top margin take care of the rest
      blocks[i].style.top = '0px';
      // storing height of each of these cards in an array called "heights"
      heights.push(blocks[i].offsetHeight + margin);
    }
  } else if (blocks.length !== 1) {
    for (let i = 0; i < blocks.length; i++) {
      // I want the white space to be divided evenly on the left and right side of the page
      blocks[i].style.left = `${
        (whiteSpace + margin) / 2 + (colWidth + margin) * i
      }px`;
      // placing the cards at the top of their container and letting top margin take care of the rest
      blocks[i].style.top = '0px';
      // storing height of each of these cards in an array called "heights"
      heights.push(blocks[i].offsetHeight + margin);
    }
  } else if (blocks.length === 1) {
    blocks[0].style.left = `${(windowWidth - colWidth) / 2}px`;
    blocks[0].style.top = '0px';
    heights.push(blocks[0].offsetHeight + margin);
  }

  // placing the remainder of the cards
  for (let i = colCount; i < blocks.length; i++) {
    // calculating the smallest value in the array of heights
    min = Math.min(...heights);
    // calculating the index of the smallest value
    index = heights.findIndex(n => n === min);
    // placing a card below the shortest card column
    blocks[i].style.left = `${blocks[index].offsetLeft}px`;
    blocks[i].style.top = `${heights[index]}px`;
    // updating the heights array to reflect the new height of the column
    heights[index] += blocks[i].offsetHeight + margin;
  }
  footer.style.top = `${Math.max(...heights) + 20}px`;
  // resetting the heights array to reuse this function if needed
  heights.length = [];
  return;
}
function dropDown() {
  const toggles = document.querySelectorAll('.dropdown__toggle');
  for (let toggle of toggles) {
    toggle.addEventListener('click', function (event) {
      event.preventDefault();
      const dropdown = event.target.parentNode;
      dropdown.classList.toggle('is-open');
    });
  }
  window.onclick = function (event) {
    if (!event.target.matches('.dropdown__toggle')) {
      const dropDowns = document.querySelectorAll('.dropdown');
      for (i = 0; i < dropDowns.length; i++) {
        if (dropDowns[i].classList.contains('is-open'))
          dropDowns[i].classList.remove('is-open');
      }
    }
  };
  return;
}

// Functions that change the layout of the page
function masonryLayout() {
  const shops = document.querySelector('.container--100');
  shops.classList.remove('container--layout');
  const cards = document.querySelectorAll('.card');
  for (let card of cards) {
    card.classList.remove('card--layout');
    card.classList.remove('card--small');
  }
  setupBlocks();
  window.addEventListener('resize', setupBlocks, { signal: controller.signal });
  return;
}
function largeLayout() {
  controller.abort();
  const shops = document.querySelector('.container--100');
  shops.classList.add('container--layout');
  const cards = document.querySelectorAll('.card');
  for (let card of cards) {
    card.classList.add('card--layout');
    card.classList.remove('card--small');
  }
  return;
}
function smallLayout() {
  controller.abort();
  const shops = document.querySelector('.container--100');
  shops.classList.add('container--layout');
  const cards = document.querySelectorAll('.card');
  for (let card of cards) {
    card.classList.add('card--layout', 'card--small');
    card.classList.remove('layout--large');
  }
  return;
}

function loadImages(images) {
  colWidth = blocks[0].clientWidth;
  const pixelRatio = window.devicePixelRatio || 1.0;

  let str = `https://res.cloudinary.com/christianjosuebt/image/upload/q_auto,f_auto,fl_lossy,w_${Math.round(
    colWidth * pixelRatio
  )}/coffeeShops`;
  for (let i = 0; i < images.length; i++) {
    images[i].src = `${str}/${images[i].dataset.src}`;
  }
}

function setImages(card__image, images, colWidth) {
  const pixelRatio = window.devicePixelRatio || 1.0;
  let str = `https://res.cloudinary.com/christianjosuebt/image/upload/q_auto,f_auto,fl_lossy,w_${Math.round(
    colWidth * pixelRatio
  )}/coffeeShops`;
  const sources = [];

  for (let i = 0; i < images.length; i++) {
    const src = `${str}/${images[i].filename}`;
    sources.push(src);
  }
  Promise.all(sources.map(loadImage)).then(imgs => {
    for (let i = 0; i < imgs.length; i++) {
      if (i === 0) imgs[i].className = 'active carousel__image';
      else imgs[i].className = 'carousel__image';
      card__image.appendChild(imgs[i]);
    }
    setupBlocks();
    changePicture(card__image, imgs);
  });
  return;
}

const loadImage = src =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
// checks if element passed to it is "active" or not. Returns a boolean value
const active = element => element.classList.contains('active');

// function to change which image is "active" to the left
function changeIndexLeft(images) {
  let index = 0;
  for (let i = 0; i < images.length; i++) {
    if (active(images[i])) index = i;
  }
  for (let i = 0; i < images.length; i++) {
    if (index === 0 && i === index) {
      images[i].classList.toggle('active');
      images[images.length - 1].classList.toggle('active');
    } else if (i === index && index !== 0) {
      images[i].classList.toggle('active');
      images[i - 1].classList.toggle('active');
    }
  }
  setupBlocks();
}

// function to change which image is "active" to the right
function changeIndexRight(images) {
  // coffeeShops.forEach((img, i) => img.style.display = obj.num === i ? 'block' : 'none');
  let index = 0;
  for (let i = 0; i < images.length; i++) {
    if (active(images[i])) index = i;
  }
  for (let i = 0; i < images.length; i++) {
    if (index === images.length - 1 && i === index) {
      images[i].classList.toggle('active');
      images[0].classList.toggle('active');
    } else if (i === index && index !== images.length - 1) {
      images[i].classList.toggle('active');
      images[i + 1].classList.toggle('active');
    }
  }
  setupBlocks();
}

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
    if (images.length > 1) {
      changePicture(carousels[i], images);
      const svgs = carousels[i].querySelectorAll('.button--svg');
      display(svgs);
    }
  }
  return;
}

// adds event listeneres to the left and right buttons on images so the user can click on them and
// change the picture being displayed
function changePicture(carousel, images) {
  const rightButton = carousel.querySelector('.button--right');
  rightButton.addEventListener('click', function () {
    changeIndexRight(images);
  });
  const leftButton = carousel.querySelector('.button--left');
  leftButton.addEventListener('click', function () {
    changeIndexLeft(images);
  });
}

// waiting until everything has loaded to run the function that places cards where they
// should be
document.addEventListener('readystatechange', event => {
  if (document.readyState === 'complete') {
    setupBlocks();
    dropDown();
    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(footer);
    carousel();
  }
});

window.addEventListener('resize', setupBlocks, { signal: controller.signal });

// grabbing the layout buttons and adding event listeners to them
const masonryGrid = document.querySelector('#masonry-grid');
const largeGrid = document.querySelector('#large-grid');
const smallGrid = document.querySelector('#small-grid');
masonryGrid.addEventListener('click', masonryLayout);
largeGrid.addEventListener('click', largeLayout);
smallGrid.addEventListener('click', smallLayout);
loadImages(images);

// Much of this was written using the url below as a guideline
// https://benholland.me/javascript/2012/02/20/how-to-build-a-site-that-works-like-pinterest.html

// makes a fetch request to load user data in
function loadUser() {
  fetch('/login?isLoggedIn')
    .then(res => res.text())
    .then(u => {
      user = u;
      loadUserData(user);
    })
    .catch(error => console.log(error));
  return;
}

// if there is a user logged in, displays their username and profile picture in the navbar
// if there is no user logged in, displays a default user picture and a LOGIN button
function loadUserData(user) {
  if (user) {
    user = JSON.parse(user);
    const userVar = document.querySelector('#user');
    const nav = document.querySelector('.nav__user');

    userVar.classList.remove('hide');
    userVar.innerHTML = user.username;

    const img = new Image();
    const picture = document.createElement('div');

    img.src = user.profilePicture.url;

    picture.className = 'picture order-1';
    picture.appendChild(img);
    nav.appendChild(picture);
    nav.href = `/user/${user._id}`;
  } else {
    const login = document.querySelector('#login');
    const nav = document.querySelector('.nav__user');
    login.classList.remove('hide');

    const img = new Image();
    const picture = document.createElement('div');

    img.src =
      'https://res.cloudinary.com/christianjosuebt/image/upload/coffeeShops/smile_bpkzip.svg';
    picture.className = 'picture order-1';
    picture.appendChild(img);
    nav.appendChild(picture);
    nav.classList.add('border', 'height--80');
    nav.href = '/login';
  }
  return;
}

loadUser();

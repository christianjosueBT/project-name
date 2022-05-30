// "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --dbpath="c:\data\db"
// "C:\Program Files\MongoDB\Server\4.4\bin\mongo.exe"
//  srv: mongodb://localhost:27017/practice

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
// const mongoose = require('mongoose');
const mongodb = require('mongodb').MongoClient;
const methodOverride = require('method-override');
// const CoffeeShop = require('./models/coffeeShop');
// const User = require('./models/user');
// const Review = require('./models/review');
const cache = require('./routeCache.js');
const session = require('express-session');
const multer = require('multer');
const { storage } = require('./cloudinary');
const upload = multer({ storage });
const MongoDBStore = require('connect-mongo');
const dbUrl = process.env.LOCAL_URI || 'mongodb://localhost:27017/practice';
const port = process.env.PORT || 2000;
// let allCoffeeShops = [];

// mongoose local connection
// 'mongodb://localhost:27017/practice'
// connecting to mongoose
// mongoose
//   .connect(dbUrl, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   })
//   .catch(error => console.log(error));

const secret = process.env.SECRET || 'thiscouldbebetter';
const app = express();
const options = {
  mongoUrl: dbUrl,
  mongoOptions: {
    useUnifiedTopology: true,
  },
  crypto: {
    secret,
  },
  touchAfter: 24 * 60 * 60,
};
const sessionConfig = {
  store: MongoDBStore.create(options),
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));

// const findCoffeeShops = async () => {
//   allCoffeeShops = await CoffeeShop.find({});
//   return;
// };
// findCoffeeShops();

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  // res.locals.allCoffeeShops = allCoffeeShops;
  next();
});

// Use this middleware function to require being logged in
const requireLogin = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

/**
 * Used to perform fuzzy searches
 * @param {string} text text used for search
 * @returns {string} regex escaped result
 */
const escapeRegex = text => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

// Middleware that checks to see if current user has permission to do something
// NOTE: the if stamenent literally makes no sense (look into it when you can)
// const isAllowed = async (req, res, next) => {
//   const coffeeShop = await CoffeeShop.findById(req.params.id);
//   if (req.session.user._id != coffeeShop.author)
//     return res.redirect('/coffeeShops');
//   next();
// };

// connecting to mongodb using the mongodb driver!
mongodb
  .connect(process.env.LOCAL_URI, {
    useNewUrlParser: true,
    // poolSize: 50,
    wtimeoutMS: 2500,
  })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async client => {
    let coffeeShops;
    try {
      coffeeShops = await client
        .db(process.env.LOCAL_DB)
        .collection('coffeeshops');
    } catch (e) {
      console.error(`Error connecting to coffeeShops collection`);
    }

    // homa page
    app.get('/', async (req, res) => {
      let cursor = await coffeeShops.aggregate([
        { $sample: 2 },
        { $project: { images: 1, _id: 0 } },
      ]);
      const shops = await cursor.toArray();
      res.render('home.ejs', { shops });
    });

    // Newer version of coffeeshops page
    app.get('/coffeeShops', cache(300), async (req, res) => {
      const shopsPerPage = 10;
      let shops;
      let query = {};
      let cursor;
      let count = 0;
      // if there is a query this will run
      if (Object.keys(req.query).length !== 0) {
        // if there is a search query, filter coffeeshops by that search
        if (req.query.search) {
          const regex = new RegExp(escapeRegex(req.query.search), 'gi');
          query = { name: regex };
          // console.log(req.query.search);
        }
        if (req.query.count) {
          count = req.query.count;
        }

        cursor = await coffeeShops
          .find(query)
          .project({ images: 1, name: 1, description: 1 });
        shops = await cursor
          .limit(shopsPerPage)
          .skip(count * shopsPerPage)
          .toArray();
        res.send(shops);
        return;
        // if there ISN'T a count query and there are still more than 10 coffeeshops after filtering
        // reduce the size of coffeeshops to 10
        // if (!req.query.count && coffeeShops.length > 10) {
        //   coffeeShops.length = 10;
        // }
        // if there IS a count query and there are more than 10 coffeeshops in our variable
        // filter the relevant coffeeshops based on the value of count
        // if (req.query.count && coffeeShops.length > 10) {
        //   const count = req.query.count * 10;
        //   coffeeShops = coffeeShops.slice(count, count + 10);
        //   res.send(coffeeShops);
        //   return;
        // }
      }
      cursor = await coffeeShops
        .find(query)
        .project({ images: 1, name: 1, description: 1 });
      shops = await cursor
        .limit(shopsPerPage)
        .skip(count * shopsPerPage)
        .toArray();
      res.render('coffeeShops/index.ejs', { shops });
      return;
    });

    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });

// // render 'make a new coffeeshop' form
// app.get('/coffeeShops/new', requireLogin, (req, res) => {
//   res.render('coffeeShops/new.ejs');
// });

// // add a new coffeeshop to the database
// app.post(
//   '/coffeeShops',
//   requireLogin,
//   upload.array('coffeeShop[images]'),
//   async (req, res) => {
//     // console.log(req.files);
//     req.files.map(f => ({ url: f.path, filename: f.filename }));
//     const coffeeShop = new CoffeeShop({
//       author: req.session.user._id,
//       name: req.body.coffeeShop.name,
//       price: req.body.coffeeShop.price,
//       description: req.body.coffeeShop.description,
//     });
//     await coffeeShop.save();
//     res.redirect('/coffeeShops');
//   }
// );

// app.get('/coffeeShops/:id', async (req, res) => {
//   const coffeeShop = await CoffeeShop.findById(req.params.id).populate({
//     path: 'reviews',
//     populate: { path: 'author', select: '_id username profilePicture' },
//   });
//   let currentUser = {};
//   if (!req.session.user) {
//     currentUser = await User.findOne({ username: 'idklol' });
//   } else {
//     currentUser = await User.findById(req.session.user._id);
//   }
//   res.render('coffeeShops/showPage.ejs', { coffeeShop, currentUser });
// });

// app.get('/coffeeShops/:id/edit', requireLogin, isAllowed, async (req, res) => {
//   const coffeeShop = await CoffeeShop.findById(req.params.id);
//   res.render('coffeeShops/edit.ejs', { coffeeShop });
// });

// app.put(
//   '/coffeeShops/:id',
//   requireLogin,
//   isAllowed,
//   upload.array('coffeeShop[images]'),
//   async (req, res) => {
//     const { id } = req.params;
//     const coffeeShop = await CoffeeShop.findByIdAndUpdate(id, {
//       ...req.body.coffeeShop,
//     });
//     const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
//     coffeeShop.images.push(...imgs);
//     await coffeeShop.save();
//     res.redirect(`/coffeeShops/${coffeeShop._id}`);
//   }
// );

// app.delete('/coffeeShops/:id', requireLogin, isAllowed, async (req, res) => {
//   const { id } = req.params;
//   await CoffeeShop.findByIdAndDelete(id);
//   res.redirect('/coffeeShops');
// });

// app.post('/coffeeShops/:id/reviews', requireLogin, async (req, res) => {
//   const coffeeshop = await CoffeeShop.findById(req.params.id);
//   const review = new Review(req.body.review);
//   coffeeshop.reviews.push(review);
//   await review.save();
//   await coffeeshop.save();
//   res.redirect(`/coffeeShops/${coffeeshop._id}`);
// });

// app.get('/user/:id', async (req, res) => {
//   const userProfile = await User.findById(req.params.id).populate({
//     path: 'reviews',
//     populate: { path: 'coffeeshop', select: 'images name' },
//   });
//   res.render('users/user.ejs', { userProfile });
// });

// app.get('/register', (req, res) => {
//   res.render('users/register.ejs');
// });

// app.post('/register', async (req, res) => {
//   const { email, username, password } = req.body;
//   const user = new User({ email, username, password });
//   await user.save();
//   req.session.user = user;
//   res.redirect('/coffeeShops');
// });

// app.get('/login', (req, res) => {
//   if (Object.keys(req.query).length !== 0) {
//     res.send(res.locals.user);
//   } else res.render('users/login.ejs');
// });

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findAndValidate(username, password);
//   if (user) {
//     req.session.user = user;
//     res.redirect('/coffeeShops');
//   } else {
//     res.send('Incorrect email or password');
//   }
// });

// app.post('/logout', (req, res) => {
//   req.session.user = null;
//   res.redirect('/coffeeShops');
// });

// app.post('/postman', async (req, res) => {
//   const { body } = req;
//   console.log(body);
//   res.send(body);
// });

// app.listen(port, () => {
//   console.log(`Serving on port ${port}`);
// });

// mongodb
//   .connect(process.env.LOCAL_URI, {
//     useNewUrlParser: true,
//     wtimeoutMS: 2500,
//   })
//   .catch(err => {
//     console.error(err.stack);
//     process.exit(1);
//   })
//   .then(async client => {
//     app.listen(port, () => {
//       console.log(`listening on port ${port}`);
//     });
//   });

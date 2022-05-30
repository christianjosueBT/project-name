// const mongoose = require('mongoose');
// const User = require('../models/user');
// const CoffeeShop = require('../models/coffeeShop');
// const Review = require('../models/review');
// const { descriptions, adjectives, nouns, cloud, reviews } = require('./names');

// mongoose
//   .connect(process.env.URI, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   })
//   .catch(error => console.log(error));

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//   console.log('Database connected');
// });

// const sample = array => array[Math.floor(Math.random() * array.length)];
// const arr = [1, 2, 3];

// // 'https://res.cloudinary.com/christianjosuebt/image/upload/v1619795178/coffeeShops/'

// const seedDB = async num => {
//   await CoffeeShop.deleteMany({});
//   await User.deleteMany({});
//   await Review.deleteMany({});
//   const password = 'idklol';
//   const username = 'idklol';
//   const user = new User({
//     email: 'idklol@gmail.com',
//     username,
//     password,
//   });

//   for (let i = 0; i < num; i++) {
//     let body = '';
//     let object = {};
//     const images = [];
//     for (let j = 0; j < Math.floor(Math.random() * 4); j++) {
//       body += `${sample(reviews)}\n\n`;
//     }
//     for (let j = 0; j < 4; j++) {
//       object = {
//         url: `https://res.cloudinary.com/christianjosuebt/image/upload/q_auto,f_auto,fl_lossy/coffeeShops/${sample(
//           cloud
//         )}`,
//         filename: sample(cloud),
//       };
//       images.push(object);
//     }
//     body = body.trim();
//     const name = `${sample(adjectives)} ${sample(nouns)}`;
//     const rating = Math.random() * 5;
//     const description = sample(descriptions);
//     // const unsplash = [
//     //     `https://source.unsplash.com/collection/${sample(collections)}`,
//     //     `https://source.unsplash.com/collection/${sample(collections)}`,
//     //     `https://source.unsplash.com/collection/${sample(collections)}`,
//     //     `https://source.unsplash.com/collection/${sample(collections)}`
//     // ];
//     // https://res.cloudinary.com/christianjosuebt/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1619798171/coffeeShops/zoe-3hs4xso-4KM-unsplash_htobzn.jpg
//     // https://res.cloudinary.com/christianjosuebt/image/upload/v1619798171/coffeeShops/zoe-3hs4xso-4KM-unsplash_htobzn.jpg
//     // q_auto,f_auto,fl_lossy

//     const p = sample(arr);
//     let price = '';
//     if (p === 1) price = 'Cheap';
//     else if (p === 2) price = 'Average';
//     else if (p === 3) price = 'Expensive';
//     const coffeeShop = new CoffeeShop({
//       author: user._id,
//       name,
//       price,
//       description,
//       images,
//     });
//     const review = new Review({
//       author: user._id,
//       coffeeshop: coffeeShop._id,
//       body,
//       rating,
//     });
//     coffeeShop.reviews.push(review);
//     user.coffeeShops.push(coffeeShop._id);
//     user.reviews.push(review._id);
//     await coffeeShop.save();
//     await review.save();
//   }
//   await user.save();
//   return;
// };

// const runSeed = async () => {
//   num = 50;
//   await seedDB(num);
//   console.log(`Successfully seeded ${num} different coffeeshops!`);
//   return;
// };

// runSeed();

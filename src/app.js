import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import server from './server.js';
import { MongoClient, ServerApiVersion } from 'mongodb';
import ProductsDAO from './dao/coffeeShopsDAO.js';

// import UsersDAO from './dao/usersDAO.js';

const Uri = process.env.URI;
const port = process.env.PORT;

console.log(Uri);

// connecting to mongodb using the mongodb driver!
MongoClient.connect(Uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
  // poolSize: 50,
  wtimeoutMS: 1000,
})
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async client => {
    await ProductsDAO.injectDB(client);
    // await UsersDAO.injectDB(client);

    server.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });

// let coffeeShops;
// try {
//   coffeeShops = await client
//     .db(process.env.LOCAL_DB)
//     .collection('coffeeshops');
// } catch (e) {
//   console.error(`Error connecting to coffeeShops collection`);
// }

// // homa page
// app.get('/', async (req, res) => {
//   const size = 2;
//   let cursor = await coffeeShops.aggregate([
//     { $sample: { size } },
//     { $project: { images: 1, _id: 0 } },
//   ]);
//   const shops = await cursor.toArray();
//   res.render('home.ejs', { shops });
// });

// // Newer version of coffeeshops page
// app.get('/coffeeShops', cache(300), async (req, res) => {
//   // save all coffeeshops to a variable so they are quickly available (cached)
//   // let coffeeShops = [...res.locals.allCoffeeShops];
//   const shopsPerPage = 10;
//   let shops;
//   let query = {};
//   let cursor;
//   let count = 0;
//   // if there is a query this will run
//   if (Object.keys(req.query).length !== 0) {
//     // if there is a search query, filter coffeeshops by that search
//     if (req.query.search) {
//       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//       query = { name: regex };
//       // console.log(req.query.search);
//     }
//     if (req.query.count) {
//       count = req.query.count;
//     }

//     cursor = await coffeeShops
//       .find(query)
//       .project({ images: 1, name: 1, description: 1 });
//     shops = await cursor
//       .limit(shopsPerPage)
//       .skip(count * shopsPerPage)
//       .toArray();
//     res.send(shops);
//     return;
//     // if there ISN'T a count query and there are still more than 10 coffeeshops after filtering
//     // reduce the size of coffeeshops to 10
//     // if (!req.query.count && coffeeShops.length > 10) {
//     //   coffeeShops.length = 10;
//     // }
//     // if there IS a count query and there are more than 10 coffeeshops in our variable
//     // filter the relevant coffeeshops based on the value of count
//     // if (req.query.count && coffeeShops.length > 10) {
//     //   const count = req.query.count * 10;
//     //   coffeeShops = coffeeShops.slice(count, count + 10);
//     //   res.send(coffeeShops);
//     //   return;
//     // }
//   }
//   cursor = await coffeeShops
//     .find(query)
//     .project({ images: 1, name: 1, description: 1 });
//   shops = await cursor
//     .limit(shopsPerPage)
//     .skip(count * shopsPerPage)
//     .toArray();
//   res.render('coffeeShops/index.ejs', { shops });
//   return;
// });

// app.listen(port, () => {
//   console.log(`listening on port ${port}`);
// });

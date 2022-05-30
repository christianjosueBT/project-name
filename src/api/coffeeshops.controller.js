// import res from 'express/lib/response';
import csDAO from '../dao/coffeeShopsDAO.js';

export default class coffeeShopsController {
  static async apiGetCoffeeShops(req, res, next) {
    let filters = {},
      page,
      entries;

    try {
      entries = req.query.entries ? parseInt(req.query.entries, 10) : 10;
    } catch (e) {
      console.error(`Got bad value for entries:, ${e}`);
      entries = 10;
    }
    try {
      page = req.query.page ? parseInt(req.query.page, 10) : 0;
    } catch (e) {
      console.error(`Got bad value for page:, ${e}`);
      page = 0;
    }
    const { shopsList, totalNumShops } = await csDAO.GetCoffeeShops({
      filters,
      page,
      entries,
    });
    let response = {
      shops: shopsList,
      page: 0,
      filters: {},
      entries,
      total_results: totalNumShops,
    };
    return res.json(response);
  }

  static async apiSearchCoffeeShops(req, res, next) {
    const entries = 10;
    let page;
    try {
      page = req.query.page ? parseInt(req.query.page, 10) : 0;
    } catch (e) {
      console.error(`Got bad value for page:, ${e}`);
      page = 0;
    }
    let searchType;
    try {
      searchType = req.query.type;
    } catch (e) {
      console.error(`No search keys specified: ${e}`);
    }

    let filters = {};

    switch (searchType) {
      case 'name':
        if (req.query.name !== '') {
          filters.name = req.query.name;
        }
        break;
      case 'price':
        if (req.query.price !== '') {
          filters.price = req.query.price;
        }
        break;
      case 'reviews':
        if (req.query.reviews !== '') {
          filters.reviews = req.query.reviews;
        }
        break;
      default:
      // nothing to do
    }

    const { moviesList, totalNumMovies } = await MoviesDAO.getCoffeeShops({
      filters,
      page,
      entries,
    });

    let response = {
      movies: moviesList,
      page: page,
      filters,
      entries_per_page: entries,
      total_results: totalNumMovies,
    };

    res.json(response);
  }
}

// static async apiGetRandom(req, res, next) {
//   const {shopsList, totalNumShops} = await csDAO.getRandom();
//   let response = {
//     shops = shopsList,
//     total_results: totalNumShops,
//   }
//   res.json(response);
//   return;
// }

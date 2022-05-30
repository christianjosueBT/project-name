let coffeeShops;

export default class coffeeShopsDAO {
  static async injectDB(conn) {
    if (coffeeShops) {
      return;
    }
    try {
      coffeeShops = await conn.db(process.env.DB).collection('coffeeshops');
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in coffeeshopsDAO: ${e}`
      );
    }
  }

  /**
   * Used to perform fuzzy searches
   * @param {string} text text used for search
   * @returns {string} regex escaped result
   */
  static escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  /**
   * Generates objects necessary for a text search
   * @param {string} text input search text
   * @returns {QueryParams} params for text search
   */
  static textSearchQuery(text) {
    let reg = new RegExp(escapeRegex(text), 'gi');
    const query = { $text: { $search: this.escapeRegex(text) } };
    const meta_score = { $meta: 'textScore' };
    const project = {};
    const sort = [['score', meta_score]];

    return { query, project, sort };
  }

  /**
   * Finds and returns shops
   * Can be used with or without a query
   * ONLY TEXT QUERYS ON NAME FIELD SUPPORTED RN
   * @param {Object} filters search parameters used in the query
   * @param {number} page Page
   * @param {number} entries number of shops per page
   * @returns {GetCoffeeShopsResult} object with the matched shop results
   */
  static async getCoffeeShops({
    // default parameters
    filters = null,
    page = 0,
    entries = 10,
  } = {}) {
    let queryParams = {};
    if (filters) {
      if ('name' in filters)
        queryParams = this.textSearchQuery(filters['text']);
    }

    let { query = {}, project = {}, sort = DEFAULT_SORT } = queryParams;
    let cursor;
    try {
      cursor = await coffeeShops.find(query).project(project).sort(sort);
    } catch (e) {
      console.error(
        `Unable to find coffee shops in DAO getCoffeeShops() function 😩😩😩\n${e}`
      );
      return { shopsList: [], totalNumShops: 0 };
    }

    // Paging implementation
    const displayCursor = cursor.limit(entries).skip(page * entries);
    try {
      const shopsList = await displayCursor.toArray();
      // mongodb collection method that returns the number of items in the collection
      // that match the query
      const totalNumShops =
        page === 0 ? await coffeeShops.countDocuments(query) : 0;
      return { shopsList, totalNumShops };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents in getCoffeeShops function 😩😩😩\n${e}`
      );
      return { shopsList: [], totalNumShops: 0 };
    }
  }

  /**
   * Finds and returns x random shops
   * @returns {Object} object containing a list of the random shops found and how many there are
   */
  static async getRandom() {
    let cursor;
    const size = 2;
    try {
      cursor = await coffeeShops.aggregate([{ $sample: { size } }]);
      const shopsList = await cursor.toArray();
      const totalNumShops = size;
      return { shopsList, totalNumShops };
    } catch (e) {
      console.error(`Error in getRandom() 🙅🙅🙅\n${e}`);
      return { shopsList: [], totalNumShops: 0 };
    }
  }
}

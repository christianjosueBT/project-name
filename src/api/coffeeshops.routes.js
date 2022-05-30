import { Router } from 'express';
import csCtlr from './coffeeshops.controller.js';

const router = new Router();

router.route('/').get(csCtlr.apiGetCoffeeShops);

export default router;

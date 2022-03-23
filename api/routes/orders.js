const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const OrdersControllers = require('../controllers/orders');

router.get('/', checkAuth, OrdersControllers.order_get_all);
router.post('/', checkAuth, OrdersControllers.order_create_order);
router.get('/:orderId', checkAuth, OrdersControllers.order_get_order); 
router.delete('/:orderId', checkAuth, OrdersControllers.order_delete_order);

module.exports = router; 
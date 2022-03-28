const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const OrdersControllers = require('../controllers/orders');

router.get('/', OrdersControllers.order_get_all);
router.post('/', OrdersControllers.order_create_order);
router.get('/:orderId',  OrdersControllers.order_get_order); 
router.delete('/:orderId',  OrdersControllers.order_delete_order);
router.patch('/:orderId' , OrdersControllers.order_set_orderStatus);

module.exports = router; 
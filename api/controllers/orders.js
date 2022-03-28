const Order = require('../models/order');

const Product = require('../models/product');

const mongoose = require('Mongoose');
const order = require('../models/order');


exports.order_get_all = (req, res, next) => {
    Order.find()
    .select('product quantity _id status')
    .populate('product', 'name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    status: doc.status,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.order_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order
                .save()
        })
        .then(result => {
            console.log(result);
            const date = new Date().getTime();
            res.status(200).json({
                message: 'Orders stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    orderDate: date
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.order_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
};

exports.order_delete_order = (req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(order => {
        res.status(200).json({
            message: 'Order canceled',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {productId: 'ID', quantity: "Number"}
            }
        })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
    }); 
};

exports.order_set_orderStatus = (req, res, next) => {

    if (!req.params.orderId.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({message: 'Order ID is invalid'})
    } 

    order.findByIdAndUpdate(req.params.orderId, {status: req.body.status}, {new: true, runValidators: true})
        .then((doc) => {
            if(!doc){
                res.status(404).json({message: 'Order not found'})
            }
            res.status(200).json({
                message: 'Order status updated',
                order: doc
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({message: err.message})
        })
        
};
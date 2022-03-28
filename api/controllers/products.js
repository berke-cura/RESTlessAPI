const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');
const fs = require('fs');


exports.product_get_all = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        };
//        if (docs.length >= 0) {
            res.status(200).json(response);
//       } else {
//            res.status(404).json({
//                message: 'No entries found'
//            })
//        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.product_post_product = (req, res, next) => {
    console.log(req.file);
    console.log("2222222");

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    console.log("2222222");

    console.log(product);
    console.log("2222222");

    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Product created succesfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    } 
                }
            });
        console.log(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.product_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    console.log(Product)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log("From Database", doc);
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products'
                }
            });
        } else {
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
};

exports.product_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    };
    Product.updateOne({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: 'http:localhost:3000/products/' + id
        });
    })
    .catch(err => {
         console.log(err);
         res.status(500).json({
             error: err
         })
    });
};

exports.product_delete_product = (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
    .then(doc => {
       if(!doc) {
            res.status(404).json({ status: 'fail', message : 'Product cannot find'})
       }
       const imagePath = doc.productImage
       return fs.unlink(imagePath, (err) => {
           if(err) {
                res.status(500).json({ status: 'fail', message: 'Product Image Cannot Delete On Server', error: err})
           }
           console.log("File deleted on server")
       })
    })
    .then(() => {
       return Product.remove({_id: id})
    })
    .then( () => {
        res.status(200).json({
            message: 'Product deleted',
            product_id : id
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

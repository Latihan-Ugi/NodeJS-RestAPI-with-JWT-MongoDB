const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('./../models/products');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'this products'
    });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    product.save().then(result => {
        console.log(result);
    }).catch(e => {
        console.log(e);
    })
    res.status(201).json({
        message: 'this post products',
        createdProduct: product
    });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({error: e});
        });
});

router.patch('/:id', (req, res, next) => {
    res.status(200).json({
        message: 'this products '+ req.params.id
    });
});

router.delete('/:id', (req, res, next) => {
    res.status(200).json({
        message: 'this products '+ req.params.id
    });
});


module.exports = router;
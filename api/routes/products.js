const express = require('express');
const router = express.Router();
const url = require('url');  
const querystring = require('querystring');  
const mongoose = require('mongoose');

const Product = require('./../models/products');

router.get('/', (req, res, next) => {
    let parsedUrl = url.parse(req.originalUrl);  
    let parsedQs = querystring.parse(parsedUrl.query);
    let limit = 10;
    let offset = 0;
    let orderby = -1;
    if(parsedQs.limit !== undefined && parsedQs.offset !== undefined){
        limit = parseInt(parsedQs.limit);
        offset = parseInt(parsedQs.offset);
    }
    if(parsedQs.orderby !== undefined) {
        orderby = parsedQs.orderby
    }
    /* Count all data */
    let count = Product.count();
    Product.find()
        .limit(limit)
        .sort({created_at: orderby})
        .skip(offset)
        .exec()
        .then(result => {
            Promise.resolve(count)
                .then(datacount => {
                    res.status(200).json({
                        data: result,
                        total_data: datacount
                    });
                })
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'data successful added',
                createdProduct: product
            });
        }).catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .exec()
        .then(result => {
            console.log(result);
            if(result){
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: "Data not found!"
                })
            }
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({error: e});
        });
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({error: e});
        });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(e => {
            res.status(500).json({
                error: e
            })
        });
});


module.exports = router;
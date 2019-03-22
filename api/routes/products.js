const express = require('express');
const router = express.Router();
const url = require('url');  
const querystring = require('querystring');  
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('./../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './assets/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
});
const fileFilterCek = (req, file, cb) => {
    /* reject file */
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilterCek
})

/* Controller */
const productC = require('./../controllers/products');

/* Model */
const Product = require('./../models/products');

router.get('/', checkAuth,  productC.product_get_all);

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'created product successfully',
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
    const updateOps = {
        updated_at: new Date()
    };
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
    Product.deleteOne({ _id: id })
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
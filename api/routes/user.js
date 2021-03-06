const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./../models/user');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(result_user => {
            if(result_user.length >= 1){
                return res.status(409).json({
                    message: 'email exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'user created'
                                });
                            })  
                            .catch(e => {
                                console.log(e)
                                res.status(500).json({
                                    error: e
                                });
                            });
                    }
                });
            }
        })
});

router.post('/login', (req, res, next) => {
    User.find({
        email: req.body.email
    })
    .exec()
    .then(result => {
        if(result.length < 1) {
            return res.status(401).json({
                message: 'email not found!'
            })
        }
        bcrypt.compare(req.body.password, result[0].password, (err, cek) => {
            if(err){
                return res.status(401).json({
                    message: 'password is wrong'
                });
            } 
            if(cek) {
                const token = jwt.sign({
                        email: result[0].email,
                        userId: result[0]._id
                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: 'auth successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'auth failed'
            });
        });
    })
    .catch(e => {
        res.status(500).json({
            error: e
        });
    })
});

module.exports = router;
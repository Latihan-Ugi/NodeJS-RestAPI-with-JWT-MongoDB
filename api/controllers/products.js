const url = require('url');  
const querystring = require('querystring');  

const Product = require('./../models/products');

exports.product_get_all = (req, res, next) => {
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
    let count = Product.countDocuments();
    Product.find()
        .select('_id name price productImage created_at updated_at')
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
};
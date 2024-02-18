const uuid = require('uuid/v1');
const Product = require('../models/Product');

exports.getAllProducts = (req, res, next) => {
	console.time('getAllProducts');
	console.log(`Je debug !!! - getAllProducts`);
	
  Product.find().then(
    (products) => {
      const mappedProducts = products.map((product) => {
        product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
        return product;
      });
      res.status(200).json(mappedProducts);
    }
  ).catch(
    () => {
      res.status(500).send(new Error('Database error!'));
    }
  );
  	console.timeEnd('getAllProducts');
};

exports.getOneProduct = (req, res, next) => {
	const dateTimeObject = new Date();
	console.log("A date-time object is created")

	console.log(`Date: ${dateTimeObject.toDateString()}`);
	console.log(`Time: ${dateTimeObject.toTimeString()}`);
/* 	A date-time object is created
	Date: Fri Feb 09 2024
	Time: 15:56:04 GMT+0100 (heure normale d’Europe centrale) */
	
	
	console.time('getOneProduct');
	console.log(`Je debug !!! - getOneProduct`);
  Product.findById(req.params.id).then(
    (product) => {
      if (!product) {
        return res.status(404).send(new Error('Product not found!'));
      }
      product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
      res.status(200).json(product);
    }
  ).catch(
    () => {
      res.status(500).send(new Error('Database error!'));
    }
  )
   	console.timeEnd('getOneProduct');
};

/**
 *
 * Expects request to contain:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- array of product _id
 *
 */
exports.orderProducts = (req, res, next) => {
	console.time('orderProducts');
	console.log(`Je debug !!! - orderProducts`);
  if (!req.body.contact ||
      !req.body.contact.firstName ||
      !req.body.contact.lastName ||
      !req.body.contact.address ||
      !req.body.contact.city ||
      !req.body.contact.email ||
      !req.body.products) {
    return res.status(400).send(new Error('Bad request!'));
  }
  let queries = [];
  for (let productId of req.body.products) {
    const queryPromise = new Promise((resolve, reject) => {
      Product.findById(productId).then(
        (product) => {
          if (!product) {
            reject('Product not found: ' + productId);
          }
          product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
          resolve(product);
        }
      ).catch(
        () => {
          reject('Database error!');
        }
      )
    });
    queries.push(queryPromise);
  }
  Promise.all(queries).then(
    (products) => {
      const orderId = uuid();

      return res.status(201).json({
        contact: req.body.contact,
        products: products,
        orderId: orderId
      })
    }
  ).catch(
    (error) => {
      return res.status(500).json(new Error(error));
    }
  );
    console.timeEnd('orderProducts');
};

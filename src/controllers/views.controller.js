import productModel from '../dao/models/products.model.js';
import cartModel from "../dao/models/carts.model.js";
import { ProductService } from '../services/index.js';
import User from '../dao/models/user.model.js';
import logger from '../logger.js'
import { calculateSubtotal, calculateTax } from "../utils.js";


export const readViewsHome = async (req,res) => {
  try {
    const featuredProducts = await ProductService.getFeaturedProducts(10);
    res.render("inicio", { featuredProducts });
  } catch (error) {
    logger.error('Error al leer los productos en tiempo real:', error);
    res.status(500).json({ error: 'Error al leer los productos en tiempo real' });
  }
}

export const readViewsProductsController = async (req, res) => {
    try {
      //const products = await ProductModel.find().lean().exec();
      let pageNum = parseInt(req.query.page) || 1;
      let itemsPorPage = parseInt(req.query.limit) || 9;
      const products = await productModel.paginate({}, { page: pageNum, limit: itemsPorPage, lean: true });
  
      products.prevLink = products.hasPrevPage ? `/products?limit=${itemsPorPage}&page=${products.prevPage}` : '';
      products.nextLink = products.hasNextPage ? `/products?limit=${itemsPorPage}&page=${products.nextPage}` : '';

      const cartID = req.session.user ? req.session.user.cart : null;

      // Obtener los datos del usuario desde la sesión
    //const userInfo = {
      //  first_name: req.session.user.first_name,
        //last_name: req.session.user.last_name,
        //email: req.session.user.email,
        //age: req.session.user.age,
        //role: req.session.user.role,
    //};

      // Renderizar la vista de productos y pasar los datos del usuario
    res.render('home', { ...products, cartID});
    } catch (error) {
      logger.error('Error al leer los productos:', error);
        res.status(500).json({ error: 'Error al leer los productos' });
    }
}

export const readViewsRealTimeProductsController = async (req, res) => {
  try {
    //const products = await ProductModel.find().lean().exec();
    const products = await ProductService.getAll()
    const userInfo = {
      email: req.session.user.email,
      role: req.session.user.role,
    };
    res.render('realTimeProducts', { products, userInfo });
  } catch (error) {
    logger.error('Error al leer los productos en tiempo real:', error);
    res.status(500).json({ error: 'Error al leer los productos en tiempo real' });
  }
}

export const readViewsProductController = async (req, res) => {
  try {
    const id = req.params.cid
    const result = await ProductService.getById(id)
    const cartInfo = {
      cart: req.session.user.cart,
    };

    if (result === null) {
      return res.status(404).json({ status: 'error', error: 'Product not found' });
    }
    res.render('product', { product: result, cartID: cartInfo.cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los productos' });
  }
}


export const readViewsCartController = async (req, res) => {
  try {
    if (req.session.passport && req.session.passport.user) {
      const userID = req.session.passport.user;
      const user = await User.findById(userID).lean().exec();
      if (user === null) {
        return res.status(404).json({ status: 'error', error: 'User not found' });
      }

      const cartID = user.cart;
      const result = await cartModel.findById(cartID)
        .populate('products.product', 'title price thumbnail')
        .lean()
        .exec();
      if (result === null) {
        return res.status(404).json({ status: 'error', error: 'Cart not found' });
      }
      console.log(result.products);

      const subtotal = calculateSubtotal(result.products);
      const tax = calculateTax(subtotal);
      const total = subtotal + tax;

      res.render('carts', { cid: result._id, products: result.products, subtotal, tax, total });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
}


export const readViewsChats = async (req, res) => {
  res.render("chat")
}
const Product = require('../model/Product');
const {Categories } = require('../model/categories');
exports.fetchAllProducts = async (req, res) => {
    let condition = {}

    if (!req.query.admin) {
        condition.deleted = { $ne: true }
    }

    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        condition.title = { $regex: searchRegex };
    }
    let query = Product.find(condition);
    let totalProductsQuery = Product.find(condition);
    if (req.query.category) {
        query = query.find({ category: { $in: req.query.category } });
        totalProductsQuery = totalProductsQuery.find({
            category: { $in: req.query.category },
        });
    }
    if (req.query.brand) {
        query = query.find({ brand: { $in: req.query.brand } });
        totalProductsQuery = totalProductsQuery.find({ brand: { $in: req.query.brand } });
    }
    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalDocs = await totalProductsQuery.count().exec();

    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    try {
        const docs = await query.exec();
        res.set('X-Total-Count', totalDocs);
        res.status(200).json(docs);
    } catch (err) {
        res.status(400).json(err);
    }
};
exports.createProduct = async (req, res) => {
    // this product we have to get from API body
    try {
        const { title, description, price, discountPercentage, rating, stock, brand, thumbnail, images, colors, sizes, highlights, discountPrice, category } = req.body;

        // Check if the category already exists, if not create it
        let newCategory = await Categories .findOne({ label: category });
        if (!newCategory) {
            newCategory = new Categories ({ value: category ,label:category });
            await newCategory.save();
        }

        // Create a new product
        const product = new Product({
            title,
            description,
            price,
            discountPercentage,
            rating,
            stock,
            brand,
            thumbnail,
            images,
            colors,
            sizes,
            highlights,
            discountPrice,
            category: newCategory.label // Assign the category ID to the product
        });

        // Save the product to the database
        const newProduct = await product.save();

        // Send a success response with the newly created product
        res.status(201).json(newProduct);
    } catch (err) {
        // If an error occurs during product or category creation or saving, send an error response
        res.status(400).json({ error: err.message });
    }
};


exports.fetchProductById = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    try {
        res.status(201).json(product)
    } catch (err) {
        res.status(400).json(err)
    }
}
exports.filterProducts = async (req, res, next) => {
  
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findById(categoryId);

        if (!categoryId) {
            return res.status(404).json({ message: "Category not found" });
        }
console.log(categoryId);
        // const products = await Product.find({ category: categoryId });
        res.json(categoryId);
    } catch (error) {
        console.error('Error sorting products:', error);
        res.status(500).send('Server Error');
    }
}

exports.updateProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true })
        product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100))
        const updatedProduct = await product.save()
        res.status(200).json(updatedProduct);

    } catch (err) {
        res.status(400).json(err);
    }
}

exports.deletedProduct = async (req, res, next) => {
    try {
        // Find the product by its ID and delete it
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        // If the product is not found, return a 404 status
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Send a success response with the deleted product
        res.json({ message: 'Product deleted successfully', deletedProduct });
    } catch (err) {
        // If an error occurs during product deletion, send an error response
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.readAllProducts = async (req, res, next) => {
    try {
        
        const { categories, colors, price } = req.body; // Extract filter parameters from the request body
        const filters = {};
      
        if (categories) {
          filters.category = { $in: categories }; // Match products with specified categories
        }
      
        if (colors) {
          filters.color = { $in: colors }; // Match products with specified colors
        }
      
        if (price) {
          // Parse price range from request body
          const [minPrice, maxPrice] = price.split('-');
          
          // Match products with price within the specified range
          filters.price = { $gte: minPrice, $lte: maxPrice };
        }
      
        // Use filters in the query to retrieve matching products
        const products = await Product.find(filters).sort({ price: 1 }).exec(); // Sort products by price in ascending order
      
        res.status(200).json(products);
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };

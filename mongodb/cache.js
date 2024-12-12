const { connectToDatabase, LIMIT_PER_PAGE, closeConnection } = require('@/mongodb/database');

const CACHE_EXPIRATION_TIME = 1000 * 60 * 30; // 30 minutes
const DB_NAME = 'products';
let CACHE = null;
let CACHE_TIMESTAMP = null;

export function isCacheValid() {
    if (CACHE === null) return false;

    return Date.now() - CACHE_TIMESTAMP <= CACHE_EXPIRATION_TIME;
}

export async function updateCache() {
    const db = await connectToDatabase();
    const productsCollection = db.collection(DB_NAME);
    const data = await productsCollection.find({}, { projection: { _id: 0 } }).toArray();

    await closeConnection();

    CACHE_TIMESTAMP = Date.now();
    CACHE = data.sort((a, b) => a.id - b.id);
}

export async function createNewProduct(newProduct) {
    if (!isCacheValid()) await updateCache();

    const biggestId = CACHE.reduce((max, current) => Math.max(max, current.id), 0);
    const nextId = biggestId + 1;

    const productWithId = { ...newProduct, id: nextId };

    const db = await connectToDatabase();
    const productsCollection = db.collection(DB_NAME);

    await productsCollection.insertOne(productWithId);
    await closeConnection();

    CACHE.push(productWithId);
    CACHE.sort((a, b) => a.id - b.id);

    return {
        success: true,
        message: 'Product created successfully',
        product: productWithId,
    };
}

export async function deleteProduct(id) {
    const db = await connectToDatabase();
    const productsCollection = db.collection(DB_NAME);

    const result = await productsCollection.deleteOne({ id });

    await closeConnection();

    console.log(id, result)

    if (result.deletedCount === 0) {
        throw new Error('Product not found');
    }

    if (!isCacheValid()) {
        await updateCache();
    } else {
        const productIndex = CACHE.findIndex(item => item.id === id);
        if (productIndex !== -1) {
            CACHE.splice(productIndex, 1);
        }
    }

    return {
        success: true,
        message: 'Product deleted successfully',
    };
}


export async function updateProductCache(id, updatedProduct) {
    const productIndex = CACHE.findIndex(item => item.id === id);

    if (productIndex !== -1) {
        CACHE[productIndex] = { ...CACHE[productIndex], ...updatedProduct };
        return true;
    }

    return false;
}

export async function editProductInDatabase(id, updates) {
    const db = await connectToDatabase();
    const productsCollection = db.collection(DB_NAME);

    // Update the product in the database
    const result = await productsCollection.updateOne(
        { id },
        { $set: updates }
    );

    await closeConnection();

    if (result.matchedCount === 0) {
        throw new Error('Product not found');
    }

    // Update the cache if the product exists there
    if (!isCacheValid()) {
        await updateCache();
    } else {
        const cacheUpdated = await updateProductCache(id, updates);
        if (!cacheUpdated) {
            await updateCache();
        }
    }

    return {
        success: true,
        message: 'Product updated successfully',
    };
}

export async function getPageCache(page = 1, limit = 0, name = '', category = '') {
    if (!isCacheValid()) await updateCache();

    if (limit > LIMIT_PER_PAGE || limit === 0) limit = LIMIT_PER_PAGE;

    let products = CACHE.filter(item => {
        const nameMatch = name === '' || item.name.toLowerCase().includes(name.toLowerCase());
        const categoryMatch = category === '' || (item.category && item.category.toLowerCase().includes(category.toLowerCase()));
        return nameMatch && categoryMatch;
    });

    const pos = (page - 1) * limit;
    products = products.slice(pos, pos + limit);

    products = products.map(item => {
        const { description, reviews, ...rest } = item;
        return rest;
    });

    const responseData = {
        products,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(CACHE.length / limit),
            totalProducts: CACHE.length,
        },
    };

    return responseData;
}

export async function getProductCache(id) {
    if (!isCacheValid()) await updateCache();

    const product = CACHE.find(item => item.id === id);
    if (!product) throw new Error('Product not found');

    return product;
}

export async function getNextID() {
    if (!isCacheValid()) await updateCache();

    const biggestId = CACHE.reduce((max, current) => Math.max(max, current.id), 0);
    const nextId = biggestId + 1;
    return nextId;
}
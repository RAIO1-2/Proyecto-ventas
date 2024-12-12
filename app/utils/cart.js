export const CART_KEY = 'cart';

export const getCart = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (product) => {
    const cart = getCart();
    const existingProduct = cart.find((item) => item.id === product.id);
    if (!existingProduct) {
        const updatedCart = [...cart, { id: product.id, quantity: 1 }];
        saveCart(updatedCart);
    }
};

export const removeFromCart = (product) => {
    const cart = getCart();
    const updatedCart = cart.filter((item) => item.id !== product.id);
    saveCart(updatedCart);
};

export const updateCartQuantity = (product, quantity) => {
    const cart = getCart();
    const updatedCart = cart.map((item) =>
        item.id === product.id
            ? {
                ...item,
                quantity: Math.min(quantity, (product.stock || Infinity), (product.limit || Infinity)),
            }
            : item
    );
    saveCart(updatedCart);
};

export const isProductInCart = (productId) => {
    const cart = getCart();
    return cart.find((item) => item.id === productId) || null;
};

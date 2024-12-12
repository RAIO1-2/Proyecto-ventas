'use client';

import React, { useState, useEffect } from "react";
import CartItem from "@/app/components/CartItem";
import { getCart } from '@/app/utils/cart';
import { useTranslations } from 'next-intl';

const CartPage = () => {
    const t = useTranslations('Cart');

    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        const cartData = await getCart(); // Fetch cart data

        // Fetch detailed product data for each item in the cart
        const detailedCartData = await Promise.all(
            cartData.map(async (item) => {
                const response = await fetch(`/api/products/${item.id}`);
                const productData = await response.json();
                return { ...item, ...productData?.product }; // Merge product data with cart data
            })
        );

        setCart(detailedCartData); // Update state with merged data
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        fetchData();

        // Listener for localStorage changes
        const handleStorageChange = (event) => {
            if (event.key === "cart") { // Listen only to changes on the "cart" key
                fetchData();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const formattedPrice = (price) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);

    // Handle item quantity change (increase, decrease, manual input)
    const handleQuantityChange = (id, newQuantity) => {
        setCart(cart.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    // Handle removing an item from the cart
    const handleRemoveFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    // Calculate total price
    const total = cart.reduce((sum, item) => sum + (item.discountedPrice || item.price || 0) * item.quantity, 0);
    const oldTotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const discount = oldTotal - total;
    const discountPercentage = Math.round(((oldTotal - total) / oldTotal) * 100);

    return (
        <main className="container">
            {isLoading && (
                <div className="d-flex justify-content-center align-items-center ignore-padding" style={{ height: '100vh' }}>
                    <div className="spinner-border text-primary" role="status" />
                </div>
            )}
            {cart.length === 0 && (
                <h1 className="my-4 display-6">{t('empty')}</h1>
            )}
            {!isLoading && cart.length !== 0 && (
                <>
                    <h1 className="mb-4">{t('your_cart')}</h1>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col" style={{ width: '5%' }}># ID</th>
                                <th scope="col" style={{ width: '35%' }}>{t('product')}</th>
                                <th scope="col" style={{ width: '20%' }}>{t('quantity')}</th>
                                <th scope="col" style={{ width: '20%' }}>{t('unit_price')}</th>
                                <th scope="col" style={{ width: '20%' }}>{t('total_price')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <CartItem
                                    key={item.id}
                                    product={item}
                                    onRemove={handleRemoveFromCart}
                                    onQuantityChange={handleQuantityChange}
                                />
                            ))}
                        </tbody>
                        <tfoot>
                            {discount > 0 && (
                                <tr>
                                    <td colSpan="4" className="text-end align-middle"><strong>{t('discount')}:</strong></td>
                                    <td className="align-middle text-info">
                                        <strong>-{formattedPrice(discount)}</strong>
                                        <strong className="ms-2">({discountPercentage}% OFF)</strong>
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan="4" className="text-end align-middle"><strong>{t('total', { currency: 'USD' })}:</strong></td>
                                <td className="align-middle">
                                    <strong>{formattedPrice(total)}</strong>
                                    <span className="text-muted ms-2" style={{ textDecoration: 'line-through', fontSize: '0.9rem' }}>
                                        {formattedPrice(oldTotal)}
                                    </span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </>
            )}
        </main>
    );
};

export default CartPage;

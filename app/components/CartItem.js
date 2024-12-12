import React from "react";
import { Button, Form } from "react-bootstrap";
import Link from "next/link";
import { removeFromCart, updateCartQuantity } from '@/app/utils/cart';
import { AvalynxAlert } from 'avalynx-alert';
import { useTranslations } from 'next-intl';

const CartItem = ({ product, onRemove, onQuantityChange }) => {
    const t = useTranslations('product');

    const formattedPrice = (price) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);

    const handleDecrease = () => {
        const newQuantity = Math.max(1, product.quantity - 1);
        updateCartQuantity(product, newQuantity);
        onQuantityChange(product.id, newQuantity);
    };

    const handleIncrease = () => {
        const newQuantity = product.quantity + 1;
        if (product.stock && newQuantity > product.stock) return; // Prevent increasing if stock limit is reached
        if (product.limit && newQuantity > product.limit) return; // Prevent increasing if limit is reached
        updateCartQuantity(product, newQuantity);
        onQuantityChange(product.id, newQuantity);
    };

    const handleChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            const validQuantity = Math.min(
                newQuantity,
                product.stock || Infinity,
                product.limit || Infinity
            );
            updateCartQuantity(product, validQuantity);
            onQuantityChange(product.id, validQuantity);
        }
    };

    const handleRemove = () => {
        removeFromCart(product);
        onRemove(product.id);
        new AvalynxAlert(t('removed', { product: product.name }), 'danger', {
            duration: 8000,
            position: 'bottom-right',
            closeable: true,
            autoClose: true,
            width: '400px'
        });
    };

    const isAddDisabled = (product.stock && product.quantity >= product.stock) || (product.limit && product.quantity >= product.limit);
    const maxQuantity = Math.min(product.stock || Infinity, product.limit || Infinity);
    const isLimitOne = product.limit === 1;

    const discountPercentage = product?.discountedPrice
        ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
        : null;

    return (
        <tr>
            <th scope="row" className="align-middle">{product.id}</th>
            <td>
                <Link href={`/product/${product.id}`} className="text-decoration-none text-light">
                    <div className="d-flex align-items-center" style={{ cursor: "pointer" }}>
                        <img
                            src={`/products/${product.id}/thumbnail.png`}
                            onError={(e) => {
                                e.target.src = '/products/thumbnail.png';
                            }}
                            alt={product.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                        />
                        <span>{product.name}</span>
                    </div>
                </Link>
            </td>
            <td className="align-middle">
                <div className="d-flex align-items-center">
                    {!isLimitOne ? (
                        <>
                            <Form.Control
                                type="number"
                                value={product.quantity}
                                onChange={handleChange}
                                style={{ width: '50px', textAlign: 'center' }}
                                min="1"
                                max={maxQuantity}
                            />
                        </>
                    ) : (
                        <Form.Control
                            type="number"
                            value={product.quantity}
                            onChange={handleChange}
                            style={{ width: '50px', textAlign: 'center' }}
                            min="1"
                            max="1"
                            disabled
                        />
                    )}
                    <Button
                        variant="danger"
                        onClick={handleRemove}
                        className="ms-2"
                    >
                        <i className="bi bi-trash3-fill"></i>
                    </Button>
                    {!isLimitOne && (
                        <>
                            <Button
                                variant="secondary"
                                onClick={handleDecrease}
                                disabled={product.quantity === 1}
                                className="ms-2"
                            >
                                <i className="bi bi-dash-lg"></i>
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleIncrease}
                                disabled={isAddDisabled}
                                className="ms-2"
                            >
                                <i className="bi bi-plus-lg"></i>
                            </Button>
                        </>
                    )}
                </div>
            </td>
            {product.stock === 0
                ? (
                    <td className="align-middle">{t('out_of_stock')}</td>
                )
                : !product.price
                    ? (
                        <td className="align-middle">{t('unavailable')}</td>
                    )
                    : (product.discountedPrice ? (
                        <td className="align-middle">{formattedPrice(product.discountedPrice)}
                            <span className="text-muted ms-2" style={{ textDecoration: 'line-through', fontSize: '0.9rem' }}>{formattedPrice(product.price)}</span>
                        </td>
                    ) : (
                        <td className="align-middle">{formattedPrice(product.price)}</td>
                    )
                    )
            }
            {product.stock === 0
                ? (
                    <td className="align-middle">{t('out_of_stock')}</td>
                )
                : !product.price
                    ? (
                        <td className="align-middle">{t('unavailable')}</td>
                    )
                    : (product.discountedPrice ? (
                        <td className="align-middle">{formattedPrice(product.discountedPrice * product.quantity)}
                            <span className="text-muted ms-2" style={{ textDecoration: 'line-through', fontSize: '0.9rem' }}>{formattedPrice(product.price * product.quantity)}</span>
                            <strong className="ms-2">({discountPercentage}% OFF)</strong>
                        </td>
                    ) : (
                        <td className="align-middle">{formattedPrice(product.price * product.quantity)}</td>
                    )
                    )
            }
        </tr>
    );
};

export default CartItem;

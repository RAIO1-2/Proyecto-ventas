import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import Link from 'next/link';
import { addToCart, removeFromCart, isProductInCart, updateCartQuantity } from '@/app/utils/cart';
import { AvalynxAlert } from 'avalynx-alert';
import { useTranslations } from 'next-intl';

const renderRating = (rating, totalRatings) => (
  <span className="d-flex align-items-center">
    <i className="bi bi-star-fill text-muted me-1"></i>
    <span>{rating.toFixed(1)}</span>
    <span className="ms-1">({totalRatings})</span>
  </span>
);

const ProductCard = ({ product }) => {
  const t = useTranslations('product');

  const [inCart, setInCart] = useState(null);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const item = isProductInCart(product.id);
    if (item) {
      setInCart(true);
      setQuantity(item.quantity);
    } else {
      setInCart(false);
    }
  }, [product.id]);

  const totalRatings = product.reviewCount || 0;
  const averageRating = product.rating || 0;

  const discountPercentage = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : null;

  const formattedPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);

  const handleAddToCart = (event) => {
    event.preventDefault();
    addToCart(product);
    setInCart(true);
    setQuantity(1);
    new AvalynxAlert(t('added', { product: product.name }), 'success', {
      duration: 8000,
      position: 'bottom-right',
      closeable: true,
      autoClose: true,
      width: '400px'
    });
  };

  const handleRemoveFromCart = (event) => {
    event.preventDefault();
    removeFromCart(product);
    setInCart(false);
    setQuantity(0);
    new AvalynxAlert(t('removed', { product: product.name }), 'danger', {
      duration: 8000,
      position: 'bottom-right',
      closeable: true,
      autoClose: true,
      width: '400px'
    });
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      // Ensure quantity doesn't exceed stock or limit
      const validQuantity = Math.min(
        newQuantity,
        product.stock || Infinity,
        product.limit || Infinity
      );
      setQuantity(validQuantity);
      updateCartQuantity(product, validQuantity);
    }
  };

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;
    if (product.stock && newQuantity > product.stock) return; // Prevent increasing if stock limit is reached
    if (product.limit && newQuantity > product.limit) return; // Prevent increasing if limit is reached
    setQuantity(newQuantity);
    updateCartQuantity(product, newQuantity);
  };

  const handleDecreaseQuantity = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
    updateCartQuantity(product, newQuantity);
  };

  // Disable "Add" button if stock or limit is reached
  const isAddDisabled = (product.stock && quantity >= product.stock) || (product.limit && quantity >= product.limit);

  // Calculate max quantity based on stock and limit
  const maxQuantity = Math.min(product.stock || Infinity, product.limit || Infinity);

  // Check if product limit is 1, and hide quantity controls if it is
  const isLimitOne = product.limit === 1;

  if (inCart === null) {
    // If `inCart` is still null (loading), show a skeleton loader
    return (
      <Card className="m-3 hover-shadow" style={{ width: '18rem', position: 'relative' }}>
        <div className="card-img-top skeleton-loader" style={{ height: '200px', backgroundColor: '#ccc' }}></div>
        <Card.Body>
          <div className="skeleton-loader" style={{ width: '80%', height: '20px', backgroundColor: '#ccc' }}></div>
          <div className="skeleton-loader" style={{ width: '60%', height: '15px', backgroundColor: '#ddd', marginTop: '10px' }}></div>
          <div className="skeleton-loader" style={{ width: '50%', height: '15px', backgroundColor: '#ddd', marginTop: '10px' }}></div>
          <div className="skeleton-loader" style={{ width: '100%', height: '40px', backgroundColor: '#ddd', marginTop: '20px' }}></div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="m-3 hover-shadow" style={{ width: '18rem', position: 'relative' }}>
      {discountPercentage && (
        <div
          className="badge bg-danger text-white rounded-pill position-absolute"
          style={{
            top: '10px',
            left: '10px',
            padding: '5px 10px',
            fontSize: '0.9rem',
            zIndex: 1,
          }}
        >
          -{discountPercentage}%
        </div>
      )}

      <Link href={`/product/${product.id}`} passHref>
        <Card.Img
          variant="top"
          src={`/products/${product.id}/thumbnail.png`}
          onError={(e) => {
            e.target.src = '/products/thumbnail.png';
          }}
          alt={product.name}
          style={{ objectFit: 'cover', cursor: 'pointer', height: '240px' }}
        />
      </Link>

      <Card.Body>
        <Link style={{ textDecoration: 'none' }} href={`/product/${product.id}`} passHref>
          <Card.Title className="text-light" style={{ cursor: 'pointer' }}>
            {product.name}
          </Card.Title>
        </Link>

        <Card.Text>
          <span className="text-muted">
            {totalRatings > 0 ? renderRating(averageRating, totalRatings) : t('no_reviews')}
          </span>
        </Card.Text>

        <Card.Text className="d-flex align-items-center">
          {product.stock === 0
            ? (
              <span>{t('out_of_stock')}</span>
            )
            : !product.price
              ? (
                <span>{t('unavailable')}</span>
              )
              : (product.discountedPrice ? (
                <>
                  <span className="text-light">{formattedPrice(product.discountedPrice)}</span>
                  <span
                    className="text-muted ms-2"
                    style={{ textDecoration: 'line-through', fontSize: '0.9rem' }}
                  >
                    {formattedPrice(product.price)}
                  </span>
                </>
              ) : (
                <span>{formattedPrice(product.price)}</span>
              )
              )
          }
        </Card.Text>

        {inCart && !isLimitOne && (
          <div className="d-flex align-items-center mb-2">
            <Button variant="secondary" onClick={handleDecreaseQuantity} disabled={quantity == 1}>
              <i className="bi bi-dash-lg"></i>
            </Button>
            <Form.Control
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="mx-2"
              style={{ width: '50px', textAlign: 'center' }}
              min="1"
              max={maxQuantity}
            />
            <Button variant="secondary" onClick={handleIncreaseQuantity} disabled={isAddDisabled}>
              <i className="bi bi-plus-lg"></i>
            </Button>
            <Button
              variant="danger"
              onClick={handleRemoveFromCart}
              className="ms-2 flex-grow-1"
            >
              <i className="bi bi-trash3-fill me-1"></i>
            </Button>
          </div>
        )}

        {inCart && isLimitOne && (
          <Button
            variant="danger"
            onClick={handleRemoveFromCart}
            className="w-100"
          >
            <i className="bi bi-trash3-fill me-2"></i>{t('remove')}
          </Button>
        )}

        {!inCart && (
          <Button
            variant="primary"
            className="w-100"
            onClick={handleAddToCart}
            disabled={isAddDisabled}
          >
            <i
              className={`bi bi-cart-plus-fill me-2 ${product.stock === 0 ? 'disabled' : ''}`}
            ></i>
            {t('add')}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, ListGroup, Form } from 'react-bootstrap';
import { addToCart, removeFromCart, isProductInCart, updateCartQuantity } from '@/app/utils/cart';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const ProductPage = ({ params }) => {
  const t = useTranslations('product');

  const [id, setId] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inCart, setInCart] = useState(null);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    // Unwrap the `params` Promise
    (async () => {
      const unwrappedParams = await params;
      setId(unwrappedParams.id);
    })();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found.');
        const data = await response.json();
        setProduct(data.product);

        const cartItem = isProductInCart(data.product.id);
        if (cartItem) {
          setInCart(true);
          setQuantity(cartItem.quantity);
        } else {
          setInCart(false);
        }
      } catch (error) {
        setError(error.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Function to render the rating and total ratings
  const renderRating = (rating, totalRatings) => {
    const fullStars = Math.floor(rating); // Full stars based on the rating
    const halfStar = rating % 1 !== 0; // Check if there's a half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Remaining stars are empty

    // Generate the star icons based on the rating
    const starIcons = [
      ...Array(fullStars).fill('bi-star-fill'),
      ...(halfStar ? ['bi-star-half'] : []),
      ...Array(emptyStars).fill('bi-star')
    ];

    return (
      <span className="d-flex align-items-center">
        {starIcons.map((star, index) => (
          <i key={index} className={`bi ${star} text-warning me-1`} />
        ))}
        <span className="ms-1">{rating.toFixed(1)}</span>
        <span className="ms-1">({totalRatings})</span>
      </span>
    );
  };

  const discountPercentage = product?.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : null;

  const formattedPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);

  // Add product to cart and initialize quantity
  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setInCart(true);
      setQuantity(1); // Default quantity when adding a new product
    }
  };

  // Remove product from cart and reset state
  const handleRemoveFromCart = () => {
    if (product) {
      removeFromCart(product);
      setInCart(false);
      setQuantity(0); // Reset quantity to zero
    }
  };

  // Update cart quantity based on user input
  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      const validQuantity = Math.min(
        newQuantity,
        product.stock || Infinity, // Enforce stock limit
        product.limit || Infinity // Enforce user-defined limit
      );
      setQuantity(validQuantity);
      updateCartQuantity(product, validQuantity);
    }
  };

  // Increment quantity in cart
  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;
    if (product.stock && newQuantity > product.stock) return; // Prevent exceeding stock
    if (product.limit && newQuantity > product.limit) return; // Prevent exceeding limit
    setQuantity(newQuantity);
    updateCartQuantity(product, newQuantity);
  };

  // Decrement quantity in cart but prevent going below 1
  const handleDecreaseQuantity = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
    updateCartQuantity(product, newQuantity);
  };

  // Disable the "Add to Cart" button if stock/limit is reached
  const isAddToCartDisabled =
    (product?.stock && quantity >= product.stock) ||
    (product?.limit && quantity >= product.limit) ||
    product?.stock === 0;

  // Calculate the maximum allowed quantity based on stock and limit
  const maxQuantity = Math.min(product?.stock || Infinity, product?.limit || Infinity);
  const isLimitOne = product?.limit === 1;

  return (
    <main className="container">
      {loading && (
        <div className="d-flex justify-content-center align-items-center ignore-padding" style={{ height: '100vh' }}>
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}

      {!loading && error && (
        <h4 className="my-4 text-danger">
          {error}
        </h4>
      )}

      {product && (
        <Row>
          <Col md={6}>
            <Card className="shadow-lg">
              <Card.Img
                variant="top"
                src={`/products/${product.id}/thumbnail.png`}
                onError={(e) => {
                  e.target.src = '/products/thumbnail.png';
                }}
                alt={product.name}
                className="img-fluid"
              />
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0">
              <Card.Body>
                <Card.Title as="h1">{product.name}</Card.Title>

                {/* Display product rating */}
                <Card.Text>
                  <span className="text-muted">
                    {product.reviewCount > 0 ? renderRating(product.rating, product.reviewCount) : t('no_reviews')}
                  </span>
                </Card.Text>

                <Card.Text>{product.description}</Card.Text>

                {/* Display price and conditional discounted price */}
                <Card.Text>
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
                          <strong className="text-light">{formattedPrice(product.discountedPrice)}</strong>
                          <span
                            className="text-muted ms-2"
                            style={{ textDecoration: 'line-through', fontSize: '0.9rem' }}
                          >
                            {formattedPrice(product.price)}
                          </span>
                          <strong className="ms-2 text-info">({(discountPercentage)}% OFF)</strong>
                        </>
                      ) : (
                        <span>{formattedPrice(product.price)}</span>
                      )
                      )
                  }
                </Card.Text>

                {inCart && !isLimitOne && (
                  <div>
                    {/* Quantity adjustment controls */}
                    <div className="d-flex align-items-center mb-3">
                      <Button variant="secondary" onClick={handleDecreaseQuantity} disabled={quantity == 1}>
                        <i className="bi bi-dash-lg"></i>
                      </Button>
                      <Form.Control
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="mx-2"
                        style={{ width: '60px', textAlign: 'center' }}
                        min="1"
                        max={maxQuantity}
                      />
                      <Button variant="secondary" onClick={handleIncreaseQuantity} disabled={isAddToCartDisabled}>
                        <i className="bi bi-plus-lg"></i>
                      </Button>
                    </div>
                  </div>
                )}

                {(inCart) ? (
                  <div className="d-flex align-items-center">
                    <Button variant="danger" onClick={handleRemoveFromCart}>
                      <i className="bi bi-trash3-fill me-2"></i>{t('remove')}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleAddToCart}
                    disabled={isAddToCartDisabled}
                  >
                    <i className="bi bi-cart-plus-fill me-2"></i>{t('add')}
                  </Button>
                )}

                {document.cookie.includes('rank_id') && (<div>
                  <Link href={`/product/${id}/edit`} passHref>
                    <Button className="mt-3" variant="secondary">
                      <i className="bi bi-pencil-fill me-2"></i>{t('edit')}
                    </Button>
                  </Link>
                </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )
      }

      {/* Display Reviews at the bottom of the page, after the product details */}
      {
        product && product.reviews && product.reviews.length > 0 && (
          <div className="mt-5 px-3 mb-4"> {/* Added margin-bottom for separation */}
            <h5 className="mb-3">{t('reviews')}</h5>
            <ListGroup className="shadow-sm">
              {product.reviews.map((review, index) => {
                const fullStars = Math.floor(review.rating); // Number of full stars (e.g., 4.5 becomes 4)
                const halfStar = review.rating % 1 !== 0; // If there's a decimal, it's a half star
                const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Remaining stars are empty

                // Generate star icons
                const starIcons = [
                  ...Array(fullStars).fill('bi-star-fill'),
                  ...(halfStar ? ['bi-star-half'] : []),
                  ...Array(emptyStars).fill('bi-star')
                ];

                return (
                  <ListGroup.Item key={index}>
                    <div className="blockquote">
                      <div className="d-flex align-items-center mb-1">
                        {starIcons.map((star, i) => (
                          <i key={i} className={`bi ${star} text-warning me-1`} />
                        ))}
                      </div>
                      <p style={{ fontSize: '1rem' }}>"{review.comment}"</p>
                      <p className="blockquote-footer" style={{ fontSize: '1rem' }}>
                        {review.reviewer}
                      </p>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        )
      }
    </main >
  );
};

export default ProductPage;

'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Pagination, Form, Button } from 'react-bootstrap';
import ProductCard from '@/app/components/ProductCard';
import { useTranslations } from 'next-intl';

const ProductsPage = () => {
    const t = useTranslations('Shop');
    const categories = ['digital', 'soft_drink'];

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const fetchProducts = async (page = 1, name = '', category = '') => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams({ page, name, category });
            const response = await fetch(`/api/products?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data.products);
            setPagination({
                currentPage: data.pagination.currentPage,
                totalPages: data.pagination.totalPages,
                totalProducts: data.pagination.totalProducts,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch products when the component first loads or when pagination changes
        fetchProducts(pagination.currentPage, searchTerm, filterCategory);
    }, [pagination.currentPage, filterCategory]); // ::: when to update :::

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
        fetchProducts(1, searchTerm, filterCategory);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setFilterCategory('');
        setPagination((prev) => ({ ...prev, currentPage: 1 }));  // Reset to first page
        fetchProducts(1, '', '');  // Fetch all products without filters
    };

    return (
        <main className="container ignore-padding">
            <h1 className="d-block d-sm-none text-center mb-4">{t('products')}</h1>
            <h1 className="d-none d-sm-block mb-4">{t('products')}</h1>
            <Row>
                {/* Sidebar */}
                <Col md={2}>
                    <Form onSubmit={handleSearch} className="mb-4">
                        <Form.Group className="mb-3">
                            <Form.Label>{t('search')}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={t('search_product')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('category')}</Form.Label>
                            <Form.Select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="">{t('categories.all')} {t('category')}</option>
                                {categories.map((key) => (
                                    <option key={key} value={key}>
                                        {t(`categories.${key}`)}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-100">
                            <i className="bi bi-search me-2"></i>{t('apply_filters')}
                        </Button>
                        {/* Reset Filters Button */}
                        <Button variant="secondary" className="w-100 mt-2" onClick={handleResetFilters}>
                            <i className="bi bi-x-circle me-2"></i>{t('reset_filters')}
                        </Button>
                        {!isLoading && document.cookie.includes('rank_id') && (
                            <Button variant="success" className="w-100 mt-4" href='/product/new/edit'>
                                <i className="bi bi-plus-circle me-2"></i>{t('new_product')}
                            </Button>
                        )}
                    </Form>
                </Col>

                {/* Main Content */}
                <Col md={10}>
                    {isLoading && (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '25vh' }}>
                            <div className="spinner-border text-primary" role="status" />
                        </div>
                    )}
                    {error && <h4 className="text-center text-danger">{t('error')}: {error}</h4>}
                    {!isLoading && !error && Array.isArray(products) && products.length > 0 ? (
                        <>
                            <Row className="mx-auto gx-0 gy-0">
                                {products.map((product) => (
                                    <Col key={product.id} sm={12} md={6} lg={4} xl={3} className="d-flex justify-content-center p-0">
                                        <ProductCard product={product} />
                                    </Col>
                                ))}
                            </Row>
                            {pagination.totalPages > 1 &&
                                <div className="d-flex justify-content-center my-4">
                                    <Pagination>
                                        <Pagination.Prev
                                            onClick={() =>
                                                setPagination((prev) => ({
                                                    ...prev,
                                                    currentPage: Math.max(prev.currentPage - 1, 1),
                                                }))
                                            }
                                            disabled={pagination.currentPage === 1}
                                        />
                                        {[...Array(pagination.totalPages)].map((_, index) => (
                                            <Pagination.Item
                                                key={index + 1}
                                                active={pagination.currentPage === index + 1}
                                                onClick={() =>
                                                    setPagination({
                                                        ...pagination,
                                                        currentPage: index + 1,
                                                    })
                                                }
                                            >
                                                {index + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next
                                            onClick={() =>
                                                setPagination((prev) => ({
                                                    ...prev,
                                                    currentPage: Math.min(prev.currentPage + 1, pagination.totalPages),
                                                }))
                                            }
                                            disabled={pagination.currentPage === pagination.totalPages}
                                        />
                                    </Pagination>
                                </div>
                            }
                        </>
                    ) : (
                        !isLoading && !error && <div className="text-center my-4">{t('no_products_found')}</div>
                    )}
                </Col>
            </Row>
        </main>
    );
};

export default ProductsPage;

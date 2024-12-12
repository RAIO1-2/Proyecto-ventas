'use client';

import DeleteProductModal from '@/app/components/DeleteProductModal';
import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { AvalynxAlert } from 'avalynx-alert';
import { useTranslations } from 'next-intl';

const ProductEditor = ({ params }) => {
    const t = useTranslations('productEditor');

    const [id, setId] = useState(null);
    const [product, setProduct] = useState(null);
    const [originalProduct, setOriginalProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);

    useEffect(() => {
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
                if (!response.ok) throw new Error(t('errorProductNotFound'));
                const data = await response.json();
                setProduct(data.product);
                setOriginalProduct(data.product);
                setThumbnailPreview(`/products/${id}/thumbnail.png`);
            } catch (error) {
                if (id !== 'new') {
                    window.location.href = '/product/new/edit';
                }
                setProduct({});
                setOriginalProduct({});
                setThumbnailPreview('/products/thumbnail.png');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, t]);


    const handleTextChange = (event, field) => {
        event.preventDefault();

        setProduct((prevProduct) => ({
            ...prevProduct,
            [field]: event.target.value,
        }));
    };

    const handleFloatChange = (event, field) => {
        event.preventDefault();

        const value = event.target.value;
        let newValue = value === '' ? null : parseFloat(value);
        newValue = newValue % 1 === 0 ? newValue : parseFloat(newValue.toFixed(2));

        if (value === '' || (!isNaN(newValue) && newValue >= 0)) {
            setProduct((prevProduct) => ({
                ...prevProduct,
                [field]: newValue,
            }));
            event.target.value = newValue;
        } else {
            event.target.value = product[field];
        }
    };

    const handleIntChange = (event, field) => {
        event.preventDefault();

        const value = event.target.value;
        const newValue = value === '' ? null : parseInt(value, 10);

        if (value === '' || (!isNaN(newValue) && newValue >= 0)) {
            setProduct((prevProduct) => ({
                ...prevProduct,
                [field]: newValue,
            }));
            event.target.value = newValue;
        } else {
            event.target.value = product[field];
        }
    };

    const handleInputChange = (event, field, type = 'text') => {
        if (type === 'float') {
            handleFloatChange(event, field);
        } else if (type === 'int') {
            handleIntChange(event, field);
        } else {
            handleTextChange(event, field);
        }
    };

    const handleFileChange = (event, field) => {
        const file = event.target.files[0];
        setThumbnailFile(file);
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setThumbnailPreview(previewUrl);
            setProduct((prevProduct) => ({
                ...prevProduct,
                [field]: file,
            }));
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            let fileUpload = null;
            if (thumbnailFile) {
                const formData = new FormData();
                formData.append('file', thumbnailFile);
                fileUpload = await fetch('/api/admin/product/upload', {
                    method: 'POST',
                    body: formData,
                });
            }

            const response = await fetch('/api/admin/product/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: Object.keys(originalProduct ?? {}).length > 0 && id, updates: product }),
            });

            const data = await response.json();

            if (response.status === 201) {
                window.location.href = `/product/${data.id}/edit`
                return;
            }

            setOriginalProduct(data.product);

            if (!response.ok || (fileUpload && !fileUpload.ok)) {
                throw new Error(data?.message || fileUpload?.message || 'Failed to update product');
            }

            new AvalynxAlert(t('productSaved'), 'info', {
                duration: 8000,
                position: 'bottom-right',
                closeable: true,
                autoClose: true,
                width: '400px'
            });
        } catch (error) {
            new AvalynxAlert(error.message, 'danger', {
                duration: 8000,
                position: 'bottom-right',
                closeable: true,
                autoClose: true,
                width: '400px'
            });
        } finally {
            setLoading(false);
        }
    };


    const handleRevert = () => {
        setProduct({ ...originalProduct });
        setThumbnailPreview(`/products/${id}/thumbnail.png`);
        setThumbnailFile(null);
    };

    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/admin/product/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id }),
            });

            if (!response.ok) throw new Error(response.message || 'Failed to delete product');

            new AvalynxAlert(t('productDeleted'), 'danger', {
                duration: 8000,
                position: 'bottom-right',
                closeable: true,
                autoClose: true,
                width: '400px'
            });

            window.location.href = '/shop';

        } catch (error) {
            new AvalynxAlert(error.message, 'danger', {
                duration: 8000,
                position: 'bottom-right',
                closeable: true,
                autoClose: true,
                width: '400px'
            });
        }
    };

    return (
        <main className="container">
            {loading && (
                <div className="d-flex justify-content-center align-items-center ignore-padding" style={{ height: '100vh' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {!loading && product && (
                <>
                    <DeleteProductModal
                        show={showModal} // Control modal visibility
                        onHide={closeModal} // Close the modal
                        onDelete={handleDelete} // Handle delete action
                    />
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb p-3 bg-body-tertiary rounded-3">
                            <li className="breadcrumb-item">
                                <a className="link-body-emphasis fw-semibold text-decoration-none" href={`/shop`}>
                                    {t('shop')}
                                </a>
                            </li>
                            <li className="breadcrumb-item">
                                <a className="link-body-emphasis fw-semibold text-decoration-none" href={id !== 'new' ? `/product/${id}` : null}>
                                    {t('product')} [{id}]
                                </a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                {t('edit')}
                            </li>
                        </ol>
                    </nav>

                    <Form className="mt-4">
                        <div className="row">
                            <div className="col-md-9">
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('name')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={product.name || ''}
                                        onChange={(e) => handleInputChange(e, 'name')}
                                        placeholder={t('name')}
                                    />
                                </Form.Group>

                                <div className="mb-3">
                                    <Form.Label className="form-label" htmlFor="customFile">{t('thumbnail')}</Form.Label>
                                    {thumbnailPreview && (
                                        <div className="mb-3">
                                            <img
                                                src={thumbnailPreview}
                                                onError={(e) => {
                                                    e.target.src = '/products/thumbnail.png';
                                                }}
                                                alt="Thumbnail Preview"
                                                className="bd-placeholder-img img-thumbnail"
                                                width="200"
                                                height="200"
                                            />
                                        </div>
                                    )}
                                    <Form.Control
                                        type="file"
                                        className="form-control"
                                        id="customFile"
                                        accept="image/png"
                                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                                    />
                                </div>

                                <Form.Group className="mb-3">
                                    <Form.Label>{t('description')}</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        value={product.description || ''}
                                        onChange={(e) => handleInputChange(e, 'description')}
                                        placeholder={t('description')}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>{t('category')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={product.category || ''}
                                        onChange={(e) => handleInputChange(e, 'category')}
                                        placeholder={t('category')}
                                    />
                                </Form.Group>
                            </div>

                            <div className="col"></div>

                            <div className="col-md-2">
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('price')}</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <Form.Control
                                            type="number"
                                            value={product.price ?? ''}
                                            onChange={(e) => handleInputChange(e, 'price', 'float')}
                                            className="form-control"
                                            style={{ textAlign: 'center' }}
                                            min="0"
                                            placeholder={t('no_price')}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>{t('discountedPrice')}</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <Form.Control
                                            type="number"
                                            value={product.discountedPrice ?? ''}
                                            onChange={(e) => handleInputChange(e, 'discountedPrice', 'float')}
                                            className="form-control"
                                            style={{ textAlign: 'center' }}
                                            min="0"
                                            placeholder={t('no_discount')}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>{t('stock')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={product.stock ?? ''}
                                        onChange={(e) => handleInputChange(e, 'stock', 'int')}
                                        className="mx-2"
                                        style={{ textAlign: 'center' }}
                                        min="0"
                                        placeholder={t('unlimited_stock')}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>{t('limit')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={product.limit ?? ''}
                                        onChange={(e) => handleInputChange(e, 'limit', 'int')}
                                        className="mx-2"
                                        style={{ textAlign: 'center' }}
                                        min="0"
                                        placeholder={t('no_limit')}
                                    />
                                </Form.Group>
                            </div>

                        </div>

                        <div className="d-flex mt-4 mb-4">
                            <div className="d-flex justify-content-start align-items-center flex-grow-1">
                                <Button variant="secondary" href={id === 'new' ? '/shop' : `/product/${id}`} className="me-3">
                                    <i className="bi bi-arrow-return-left me-2"></i>
                                    {t('return')}
                                </Button>
                                {id !== 'new' &&
                                    <Button variant="danger" className="me-3" onClick={openModal}>
                                        <i className="bi bi-trash3-fill me-2"></i>
                                        {t('delete')}
                                    </Button>
                                }
                            </div>

                            <div className="d-flex justify-content-end align-items-center flex-grow-1">
                                <Button variant="secondary" onClick={handleRevert} className="me-3">
                                    <i className="bi bi-arrow-counterclockwise me-2"></i>{t('revertChanges')}
                                </Button>
                                {id !== 'new' ?
                                    <Button variant="primary" onClick={handleSave}>
                                        <i className="bi bi-floppy2-fill me-2"></i>{t('saveChanges')}
                                    </Button>
                                    :
                                    <Button variant="primary" onClick={handleSave}>
                                        <i className="bi bi-plus-circle me-2"></i>{t('create')}
                                    </Button>
                                }
                            </div>
                        </div>

                    </Form>
                </>
            )}
        </main>
    );
};

export default ProductEditor;

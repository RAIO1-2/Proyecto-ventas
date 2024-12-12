import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function DeleteProductModal({ show, onHide, onDelete }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Delete Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                <i className="bi bi-x-lg me-2"></i>Close
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    <i className="bi bi-trash3-fill me-2"></i>Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

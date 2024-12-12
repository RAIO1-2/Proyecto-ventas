import { editProductInDatabase, createNewProduct } from '@/mongodb/cache';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { id, updates } = req.body;
            if (!updates) {
                return res.status(400).json({ message: 'Invalid request' });
            }

            if (!id) {
                const newProduct = await createNewProduct(updates);

                if (newProduct && newProduct.product && newProduct.product.id) {
                    const newId = newProduct.product.id;
                    return res.status(201).send({ message: 'Product created successfully', id: newId });
                } else {
                    return res.status(400).send({ message: 'Failed to create product: Missing product id.' });
                }
            }

            const result = await editProductInDatabase(parseInt(id, 10), updates);
            return res.status(200).json({ message: 'Product updated successfully', product: result });
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
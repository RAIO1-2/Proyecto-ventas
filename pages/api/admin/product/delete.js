import { deleteProduct } from '@/mongodb/cache';

export default async function handler(req, res) {
    const { id } = req.body;

    if (req.method === 'DELETE') {
        try {
            await deleteProduct(parseInt(id, 10));

            return res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting product' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

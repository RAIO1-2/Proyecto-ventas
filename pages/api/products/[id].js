const { getProductCache } = require('@/mongodb/cache');

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const product = await getProductCache(parseInt(id));
            res.status(200).json({ product });
        } catch (error) {
            if (error.message === 'Product not found') {
                res.status(404).json({ error: error.message });
            } else {
                console.error('Error handling GET request:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

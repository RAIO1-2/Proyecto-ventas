const { getPageCache } = require('@/mongodb/cache');

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;
        const name = req.query.name || '';
        const category = req.query.category || '';

        try {
            const responseData = await getPageCache(page, limit, name, category);
            res.status(200).json(responseData);
        } catch (error) {
            console.error('Error handling GET request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

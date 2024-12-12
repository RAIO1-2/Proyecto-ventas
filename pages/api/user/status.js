import { jwtVerify } from 'jose';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const token = req.cookies['session_id'] || req.headers.get('Authorization')?.split(' ')[1];

            // Decode and verify the token using jose
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
            const userId = payload.id;
            const rank = payload.rank;

            res.status(200).json({ id: userId, rank: rank });
        } catch (error) {
            console.error('Error handling request:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const cookieOptions = {
                secure: true,
                sameSite: 'strict',
                path: '/',
                expires: new Date(0),
            };

            const cookies = [
                serialize('session_id', '', cookieOptions),
                serialize('member_id', '', cookieOptions),
                serialize('rank_id', 'a', cookieOptions)
            ];

            res.setHeader('Set-Cookie', cookies);
            res.status(200).json({ message: 'Logged out successfully.' });
        } catch (error) {
            console.log(error)
            res.status(401).json({ message: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

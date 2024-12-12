import { createUser } from '@/mongodb/user';
import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        const token = req.cookies['session_id']?.value || req.headers['authorization']?.split(' ')[1];

        if (token) {
            return res.status(400).json({ message: 'User is already logged in, cannot create a new account' });
        }

        if (!email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            const { token, userId } = await createUser(email, password);

            const cookies = [
                serialize('session_id', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    path: '/',
                }),
                serialize('member_id', userId, {
                    httpOnly: false,
                    secure: true,
                    sameSite: 'strict',
                    path: '/',
                })
            ];

            res.setHeader('Set-Cookie', cookies);

            res.status(201).json({ message: 'Registered successfully.' });
        } catch (error) {
            if (error.message === "User already exists") {
                res.status(409).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
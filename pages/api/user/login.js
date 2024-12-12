import { authenticateUser } from '@/mongodb/user';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, rememberMe } = req.body;
    try {
      const { token, userId, rank } = await authenticateUser(email, password);

      const cookies = [
        serialize('session_id', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/',
          maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 30 : undefined, // 30 days if "Remember Me" is checked
        }),
        serialize('member_id', userId, {
          httpOnly: false,
          secure: true,
          sameSite: 'strict',
          path: '/',
          maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 30 : undefined,
        }),
      ];

      if (rank !== 'member') cookies.push(serialize('rank_id', rank, {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 30 : undefined,
      }));

      res.setHeader('Set-Cookie', cookies);

      res.status(200).json({ message: 'Logged in successfully.' });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

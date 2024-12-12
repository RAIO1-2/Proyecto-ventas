import fs from 'fs';
import path from 'path';
import { jwtVerify } from 'jose';

const profilePicturesDir = path.join(process.cwd(), 'profile-pictures');

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const token = req.cookies['session_id'] || req.headers.get('Authorization')?.split(' ')[1];

            // Decode and verify the token using jose
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
            const userId = payload.id; // Extract the userId from the decoded token

            // Retrieve the profile picture file path using the userId
            const profilePicturePath = path.join(profilePicturesDir, `${userId}.png`);

            // Use default.png if the profile picture is missing
            const defaultPicturePath = path.join(profilePicturesDir, 'default.png');
            const imagePath = fs.existsSync(profilePicturePath) ? profilePicturePath : defaultPicturePath;

            if (!fs.existsSync(imagePath)) {
                return res.status(500).json({ message: 'Default profile picture is missing from the server' });
            }

            // Use fs.createReadStream() to stream the file
            const readStream = fs.createReadStream(imagePath);
            res.setHeader('Content-Type', 'image/jpeg');  // Set the correct MIME type for the image
            readStream.pipe(res); // Pipe the read stream to the response
        } catch (error) {
            console.error('Error handling request:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getNextID } from '@/mongodb/cache';

const uploadfile = async (req, res) => {
  if (req.method === 'POST') {
    return uploadfilePOST(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

async function uploadfilePOST(req, res) {
  const refererUrl = req.headers.referer;
  if (!refererUrl) {
    return res.status(400).json({ error: 'Referer header is missing' });
  }

  const idMatch = refererUrl ? refererUrl.match(/\/product\/([^/]+)\/edit/) : null;
  let productId = idMatch ? idMatch[1] : null;

  if (!productId || (productId !== 'new' && Number(productId) !== parseInt(productId, 10))) {
    return res.status(400).json({ error: 'Product ID not found in the referer URL' });
  }
  if (productId === 'new') productId = await getNextID();

  const uploadDir = `./public/products/${productId}`;

  try {
    await fs.promises.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
    res.status(500).json({ error: 'Server error' });
    return;
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  form.on('file', (formName, file) => {
    const fileType = file.mimetype;

    if (fileType !== 'image/png') {
      fs.unlinkSync(file.filepath);
      res.status(400).json({ error: 'Only PNG files are allowed' });
      return;
    }

    const customName = 'thumbnail.png';
    const newPath = path.join(uploadDir, customName);

    fs.renameSync(file.filepath, newPath);

    file.newFilename = customName;
    file.newFilepath = newPath;
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Formidable error:', err);
      res.status(500).json({ error: 'File upload failed' });
      return;
    }

    res.status(200).json({ productId, fields, files });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default uploadfile;

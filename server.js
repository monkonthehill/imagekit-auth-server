import express from 'express';
import cors from 'cors';
import ImageKit from 'imagekit';

const app = express();
app.use(cors());

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'ImageKit Auth Service' });
});

app.post('/imagekit/auth', (req, res) => {
  const authParams = imagekit.getAuthenticationParameters();
  res.json(authParams);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

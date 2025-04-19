import express from "express";
import cors from "cors";
import ImageKit from "imagekit";

const app = express();
app.use(cors());

const imagekit = new ImageKit({
  publicKey: "public_6T1s+uCMrBoBYnXMcxIFUVFtKzU=",
  privateKey: "private_l8ib5uf1VRbauyxN0IhN613hN9U=",
  urlEndpoint: "https://ik.imagekit.io/ankurit",
});

app.get("/auth", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.listen(3000, () => console.log("Server running on port 3000"));

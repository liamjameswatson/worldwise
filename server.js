import express from "express";
import serveStatic from "serve-static";
import jsonServer from "json-server";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

const __dirname = path.resolve(); //Set __dirname to current directory

// Serve the Vite app
app.use("/", serveStatic(path.join(__dirname, "dist")));

// Use json-server to serve your JSON data
app.use("/api", jsonServer.router("data/cities.json"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

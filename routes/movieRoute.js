require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { Storage } = require("@google-cloud/storage");
const Movie = require("../models/Movies")
const path = require('path');
const router = express.Router();

// Google Cloud Storage setup
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.GCLOUD_KEY_FILE,
});
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);


// Multer setup for file upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 200 * 1024 * 1024 }, // Limit: 200MB
});

// Endpoint to get video

router.get("/", async (req, res) => {
    try {
      const movies = await Movie.find();
      res.json(movies);
    } catch (error) {
      console.error(error.message);
      res.send("server error").status(400);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id
      const movies = await Movie.findById(id);
      if(!movies){
        res.json({msg:"Your movie list is empty, get some with free Nwaro tokens"})     
      }
      res.json(movies);
    } catch (error) {
      console.error(error.message);
      res.send("server error").status(400);
    }
  });

// Endpoint to upload video
router.post('/', upload.single('video'), async (req, res) => {
    try {
      const {category, price, userId} = req.body

        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: req.file.mimetype,
        });
        blobStream.on('error', (err) => {
          res.status(500).json({ message: err.message })
        });

        blobStream.on('finish', async () => {
            const publicUrl = `https://storage.cloud.google.com/${bucket.name}/${blob.name}`;
            // Store video metadata in MongoDB
            const videoData = {
                userID:userId,
                name: req.file.originalname,
                url: publicUrl,
                size: req.file.size,
                category: category,
                price: price,
                uploadedAt: new Date(),
            };
            const movie = new Movie(videoData)
            await movie.save()
            res.status(200).json({ message: 'Upload successful', url: publicUrl });
            console.log(movie)
        });
        blobStream.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
});

module.exports = router

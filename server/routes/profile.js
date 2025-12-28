const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // multer memory storage
const User = require('../models/User');

/* =========================
   CLOUDINARY CONFIG
========================= */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =========================
   MULTER (MEMORY STORAGE)
========================= */
/* =========================
   UPLOAD PROFILE PHOTO
========================= */
router.post('/upload-photo', auth, upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Missing file (photo)' });
        }

        const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
            { folder: 'teamforge/profiles' }
        );

        await User.findByIdAndUpdate(req.user, {
            profileImage: result.secure_url,
        });

        res.json({ profileImage: result.secure_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Photo upload failed' });
    }
});

module.exports = router;

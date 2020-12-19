const router = require("express").Router();
const config = require("../config");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const Gallery = require("../models/Gallery");
const auth = require("../middleware/auth");
const { nanoid } = require('nanoid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
    try {
        const gallery = await Gallery.find().populate("userID", "_id username displayName");
        res.send(gallery);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.get("/:userID", async (req, res) => {
    const user = await User.findById(req.params.userID);
    if (!user) {
        return res.status(401).send({ error: "User does not exist" });
    }

    try {
        const galleryData = await Gallery.find({ userID: user._id });
        const userData = {
            _id: user._id,
            username: user.username,
            avatarImage: user.avatarImage,
        }
        const data = {
            userData,
            galleryData,
        };
        res.send(data);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post("/", [auth, upload.single("image")], async (req, res) => {
    req.body.userID = req.user._id;
    const imageData = req.body;

    if (req.file) {
        imageData.image = req.file.filename;
    };

    const newImage = new Gallery(imageData);
    try {
        await newImage.save();
        res.send(newImage);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete("/:imageID", auth, async (req, res) => {
    const image = await Gallery.findById(req.params.imageID);
    if (image && image.userID.toString() === req.user._id.toString()) {
        try {
            await image.remove();
            res.send({ message: "The image was successfully deleted" });
        } catch (e) {
            res.status(400).send({ message: "Something Went Wrong" });
        };
    } else if (!image) {
        res.status(400).send({ error: "The image doesn't exist" });
    } else if (image.userID.toString() !== req.user._id.toString()) {
        res.status(400).send({ error: "You can not delete this image" });
    };
});

module.exports = router;
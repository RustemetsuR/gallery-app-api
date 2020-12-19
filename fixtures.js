const mongoose = require("mongoose");
const config = require("./config");
const User = require("./models/User");
const Gallery = require("./models/Gallery");
const { nanoid } = require("nanoid");

mongoose.connect(config.db.url + '/' + config.db.name, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.once("open", async () => {
    try {
        await db.dropCollection("users");
        await db.dropCollection("galleries");
    } catch (e) {
        console.log("Collection were not presented, skipping drop...");
    };

    const [user1, user2] = await User.create(
        {
            username: 'public-user@user.com',
            password: 'User_123123',
            token: nanoid(),
            displayName: 'Valera',
            avatarImage: "https://www.shareicon.net/data/512x512/2016/05/24/770117_people_512x512.png"
        },
        {
            username: 'Vasya1999@gmail.com',
            password: 'Qwerty123',
            token: nanoid(),
            displayName: 'Vasya',
            avatarImage: "https://i.pinimg.com/736x/34/60/3c/34603ce8a80b1ce9a768cad7ebf63c56.jpg"
        }
    );

    await Gallery.create(
        //Images for User Valera:
        {
            userID: user1._id,
            image: "photo-1.jpg",
            imageTitle: "Love Tree",
        },
        {
            userID: user1._id,
            image: "photo-2.jpg",
            imageTitle: "Beautiful Rainbow",
        },
        {
            userID: user1._id,
            image: "photo-3.jpg",
            imageTitle: "I have been there!",
        },
        {
            userID: user1._id,
            image: "photo-4.jpeg",
            imageTitle: "My best friend",
        },
        //Images for User Vasya:
        {
            userID: user2._id,
            image: "photo-5.jpg",
            imageTitle: "What a Sunset!",
        },
        {
            userID: user2._id,
            image: "photo-6.jpg",
            imageTitle: "Roses are red",
        },
        {
            userID: user2._id,
            image: "photo-7.jpg",
            imageTitle: "My vacation in a nutshell",
        },
        {
            userID: user2._id,
            image: "photo-8.jpg",
            imageTitle: "Just a random girl",
        },
    );


    db.close();
});
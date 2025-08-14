import express from "express";
import passport from "passport";
import localStrategy from "passport-local";
import crypto from "crypto";
import { Mongo } from "../database/mongo.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const collectionName = "users";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const userExist = await Mongo.db.collection(collectionName).findOne({ email: userEmail });

    if (userExist) {
        return res.status(500).send({
            success: false,
            statusCode: 500,
            body: {
                text: "User already exists!",
            },
        });
    }

    const salt = crypto.randomBytes(16);

    crypto.pbkdf2(userPassword, salt, 310000, 16, "sha256", async (err, hashedPassword) => {
        if (err) {
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: "Error on crypto password",
                    err: err,
                },
            });
        }

        const result = await Mongo.db.collection(collectionName).insertOne({
            email: userEmail,
            password: hashedPassword,
            salt,
        });

        if (result.insertedId) {
            const user = await Mongo.db.collection(collectionName).findOne({ _id: new ObjectId(result.insertedId) });

            const token = jwt.sign(user, "secret");

            return res.send({
                success: true,
                statusCode: 200,
                body: {
                    text: "User registered Correctly",
                    token,
                    user,
                },
            });
        }
    });
});

passport.use(
    new localStrategy({ usernameField: "email" }, async (email, password, callback) => {
        const user = await Mongo.db.collection(collectionName).findOne({ email: email });

        if (!user) {
            return callback(null, false);
        }

        const saltBuffer = user.salt.buffer;

        crypto.pbkdf2(password, saltBuffer, 310000, 16, "sha256", (err, hashedPasswordLogin) => {
            if (err) {
                return callback(null, false);
            }

            const userPasswordBuffer = Buffer.from(user.password.buffer);

            if (!crypto.timingSafeEqual(hashedPasswordLogin, userPasswordBuffer)) {
                return callback(null, false);
            }

            const { password, salt, ...rest } = user;

            return callback(null, rest);
        });
    })
);

export default authRouter;

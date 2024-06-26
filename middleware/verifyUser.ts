import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { client } from "../index";
const jwt = require('jsonwebtoken');

const maxAge = 1 * 24 * 60 * 60; // 1 day in seconds

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err: any, decodedToken: any) => {
            if (err) {
                res.locals.user = null;
                res.redirect('/pokemon-auth');
            } else {
                let user = await User.findById(decodedToken.id);
                if (user) {
                    delete user.password;
                    res.locals.user = user;

                    // Create a new token
                    const newToken = jwt.sign({ id: decodedToken.id }, process.env.SECRET_KEY, { expiresIn: maxAge });
                    res.cookie('jwt', newToken, { httpOnly: true, maxAge: maxAge * 1000, secure: true, sameSite: 'strict'});
                    
                    // set last seen
                    const userDocument = await client.db("users").collection("usersAccounts").findOne({ _id: user._id });
                    if (userDocument) {
                        userDocument.lastSeen = new Date();
                        // Update the user's last seen date
                        await client.db("users").collection("usersAccounts").updateOne(
                            { _id: user._id },
                            { $set: { lastSeen: userDocument.lastSeen } }
                        );
                    }
                    next();
                } else {
                    res.locals.user = null;
                    res.redirect('/pokemon-auth');
                }
            }
        });
    } else {
        res.locals.user = null;
        res.redirect('/pokemon-auth');
    }
}

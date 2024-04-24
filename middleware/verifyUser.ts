import { Request, Response, NextFunction } from "express";
const User = require('../models/User') as any;
const jwt = require('jsonwebtoken');

const maxAge = 1 * 24 * 60 * 60;

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'Precious_Aziz_Mohammed', async (err : any, decodedToken : any) => {
            if (err) {
                res.locals.user = null;
                res.redirect('/pokemon-auth');
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                // Check if token is about to expire within the next 30 minutes
                const now = Math.floor(Date.now() / 1000);
                if (decodedToken.exp - now < 1800) {
                    // Refresh token
                    const newToken = jwt.sign({ id: decodedToken.id }, 'Precious_Aziz_Mohammed', { expiresIn: maxAge });
                    res.cookie('jwt', newToken, { httpOnly: true, maxAge: maxAge * 1000 });
                }
                next();
            }
        });
    }
    else {
        res.locals.user = null;
        res.redirect('/pokemon-auth');
    }
}
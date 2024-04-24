import { Request, Response, NextFunction } from "express";
const User = require('../models/User') as any;
const jwt = require('jsonwebtoken');

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'Precious_Aziz_Mohammed', async (err : any, decodedToken : any) => {
            if (err) {
                //console.log(err.message);
                res.locals.user = null;
                res.redirect('/pokemon-auth');
            } else {
                //console.log(decodedToken);
                //let user = await User.findById(decodedToken.id);
                //res.locals.user = user;
                next();
            }
        });
    }
    else {
        //res.locals.user = null;
        res.redirect('/pokemon-auth');
    }
}
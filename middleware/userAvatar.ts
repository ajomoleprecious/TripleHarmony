import { Request, Response, NextFunction } from "express";
import { client } from "../index";


export const currentAvatar = async (req: Request, res: Response, next: NextFunction) => {
    let avatar = res.locals.avatar || null;

    if (avatar === null) {
        const userAvatar = await client.db("users").collection("usersAvatars").findOne({ _id: res.locals.user._id }, { projection: { avatar: 1 } });
        avatar = userAvatar ? userAvatar.avatar : null;
    }

    if (avatar) {
        const avatarList: { [key: string]: string } = {
            "ash": "/assets/avatars/ash_ketchum.png",
            "chloe": "/assets/avatars/chloe.png",
            "dawn": "/assets/avatars/dawn.png",
            "james": "/assets/avatars/james.png",
            "jessie": "/assets/avatars/jessie.png",
            "may": "/assets/avatars/may.png",
            "serena": "/assets/avatars/serena.png",
            "none": "/assets/avatars/none.png"
        };
        res.locals.currentAvatar = avatarList[avatar];
    }
    next();
}
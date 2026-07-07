import { createUser } from '../database';

import type { Request, Response  } from 'express';

export const init = function (req: Request, res: Response) {
    console.log(
    `${req.method} ${req.originalUrl} cookie:`,
    req.cookies.anon_id
    );


    if (!req.cookies.anon_id) {
        const anonId = Math.random().toString(36).slice(2);
        const name = 'anonym'
        createUser(anonId, name);

        console.log(
        `Setting cookie ${anonId} for ${req.method} ${req.originalUrl}`
        );

        res.cookie("anon_id", anonId, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/",
        });
    }

    res.sendStatus(200);
};

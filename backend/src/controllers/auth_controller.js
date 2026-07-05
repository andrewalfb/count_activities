const { createUser } = require('../database');

const init = function (req, res) {
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

module.exports = { init };
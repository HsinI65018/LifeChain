const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get('/read/file', async (req, res) => {
    const raw = fs.readFileSync("./build/contracts/FlightDelay.json");
    const data = await JSON.parse(raw);
    res.status(200).json({"data": data.abi})
})

router.post('/flight/token', async (req, res) => {
    const response = await fetch("https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            grant_type: process.env.GRANT_TYPE,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        })
    });

    const data = await response.json();
    res.status(200).json(data)
})

module.exports = router;
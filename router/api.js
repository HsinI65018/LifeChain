const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get('/read/file', async (req, res) => {
    const raw = fs.readFileSync("./build/contracts/FlightDelay.json");
    const data = await JSON.parse(raw);
    res.status(200).json({"data": data.abi})
})

module.exports = router;
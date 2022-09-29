const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/home');
})

router.get('/user', (req, res) => {
    res.render('pages/user');
})

module.exports = router;
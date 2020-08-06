const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('members', {title: "Members", user: req.user})
})

module.exports = router
const express = require('express');
const router = express.Router();

//Test Route
router.get('/', (req, res) => {
    const data = {
        title: 'Test',
        message: 'Erste message'
    }
    res.send(JSON.stringify(data))
})

module.exports = router;
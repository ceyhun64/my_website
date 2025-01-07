const express = require('express')
const router = express.Router()

const pageInfo={
    source:'6495319.jpg',
    title:'Why Us',
    subtitle:'Read Below...'
}

router.get('/', (req, res) => {
    res.render('site/about', {pageInfo})
})

module.exports = router
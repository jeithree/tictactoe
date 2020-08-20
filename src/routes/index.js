const {Router} = require('express');

// Initializations
const router = Router();

// Routes
router.use((req, res, next) => {
    // Don't allow user to hit Heroku now that we have a domain
    const host = req.get('Host');
    const originalUrl = req.originalUrl
    if (host === 'jeitictactoe.herokuapp.com') {
        return res.redirect(301, 'https://jeithemes.com' + originalUrl);
    }
    return next();
});

router.get('/', (req, res) => {

});

module.exports = router
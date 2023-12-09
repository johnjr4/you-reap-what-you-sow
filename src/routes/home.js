var secrets = require('../config/secrets.js');

module.exports = function (router) {
    var homeRoute = router.route('/api');

    homeRoute.get(function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is ' + connectionString });
    });
    return router;
}

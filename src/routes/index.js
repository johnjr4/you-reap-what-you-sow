/*
 * Connect all of your endpoints together here.
 */


module.exports = function (app, router) {
    // homeRoutes(router);
    // userRoutes(router); // Connect user routes
    // taskRoutes(router);
    app.use('/', require('./home.js')(router));
    app.use('/api', require('./plants.js')(router));
};



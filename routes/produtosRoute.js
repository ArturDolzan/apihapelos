const config = require('../config/apiUrl')

module.exports = app => {

    app.route(`${config.routeProd}/produtos`)
        .get(app.api.produtos.getProdutos)

    app.route(`${config.routeProd}/produtos`)
        .all(app.config.passport.authenticate())
        .post(app.api.produtos.save)

    app.route(`${config.routeProd}/produtos/:id`)
        .all(app.config.passport.authenticate())
        .delete(app.api.produtos.remove)

}
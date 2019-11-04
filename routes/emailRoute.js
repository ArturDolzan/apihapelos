const config = require('../config/apiUrl')

module.exports = app => {
    app.post(`${config.routeProd}/email/confirmacaoCompra`, app.api.emailHelper.enviarEmailConfirmacao)
}
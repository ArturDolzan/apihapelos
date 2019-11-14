
exports.up = function (knex, Promise) {
    return knex.schema.createTable('produtos', table => {
        table.increments('id').primary()
        table.string('nome').notNull()
        table.string('descricao')
        table.string('tamanho')
        table.string('dimensoes')
        table.decimal('preco', 8, 2).notNullable().defaultTo(0)
        table.string('cor')
        table.decimal('desconto', 8, 2).notNullable().defaultTo(0)
        table.integer('likes').notNullable().defaultTo(0)
        table.binary('foto')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('produtos')
};

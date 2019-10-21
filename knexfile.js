module.exports = {
	client: 'postgresql',
	connection: {
		database: 'hapelos',
		user: 'postgres',
		password: 'usetudo'
	},
	pool: {
		min: 2,
		max: 10
	 }
};
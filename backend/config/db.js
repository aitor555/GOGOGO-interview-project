import { Pool } from 'pg';

const pool = new Pool({
	user: 'postgres',
	host: 'postgres',
	password: 'password',
	database: "postgres",
	port: 5432
})

pool.on('connect', () => {
	console.log("connection pool estalished with db")
})


export default pool;
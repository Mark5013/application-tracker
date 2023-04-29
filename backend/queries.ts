import pg from "pg";
import dotenv from "dotenv";
const { Pool } = pg;
dotenv.config();

const databaseConfig = { connectionString: process.env.CONN_STR };
const pool = new Pool({
	user: process.env.USER,
	host: process.env.HOST,
	database: process.env.DATABASE,
	password: process.env.PASSWORD,
	port: 5432,
});

export default pool;

import { ConnectionOptions, createConnection, getConnection, Connection } from "typeorm"
import { root } from "./path"
import { FileEntry } from "./entity/files"
import deasync from "deasync";
import dotenv from 'dotenv'
import { urlencoded } from "express";
if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

const config: ConnectionOptions = {
	name : "default",
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PWD,
	database: process.env.POSTGRES_DB,
	entities: [
	  './src/db/entity/**/*.ts',
	],
	cli: {
	  migrationsDir: 'src/migrations',
	},
	logging: false
};

export class DBFileManager{
	connection : any;
	options : any;
	
	constructor(options :ConnectionOptions = config){
		this.options = options;
		this.connection = this.connect(this.options);
	}

	connect (options :ConnectionOptions = config) : any{
		var conn;
		createConnection(options)
			.then(con=>{
				con.synchronize()
				conn = con;
			})
			.catch(err=>{
				// console.log(err);
				conn = getConnection()
			});
		while(conn === undefined) {
			deasync.sleep(100);
		}
		return conn;
	}
}

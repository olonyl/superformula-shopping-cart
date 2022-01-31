import { Knex } from "knex";
import { knexSnakeCaseMappers } from "objection";
import { join } from "path";
import Environment from "./environment";

const environment = new Environment();

export const KnexConfig: Record<string, Knex.Config> = {
	development: {
		client: "postgresql",
		connection: {
			database: environment.DATABASE,
			user: environment.USERNAME,
			password: environment.PASSWORD,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
			directory: join(__dirname, '..', 'database', 'migrations')
		},
		seeds: {
			directory: join(__dirname, '..', 'database', 'seeds')
		},
		...knexSnakeCaseMappers
	},
	production: {
		client: "pg",
		connection: {
			connectionString: environment.DATABASE_URL,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
			directory: join(__dirname, '..', 'database', 'migrations')
		},
		seeds: {
			directory: join(__dirname, '..', 'database', 'seeds')
		},
		...knexSnakeCaseMappers
	},
};
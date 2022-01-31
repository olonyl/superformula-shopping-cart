import { Knex, knex } from "knex";
import { KnexConfig } from "../config/knexfile";
import { Model } from "objection";
import { ITables } from "./tables";

export default class PsqlConnection {
    private readonly db: Knex;
    constructor() {
        var environment = process.env.NODE_ENV || 'development';
        this.db = knex(KnexConfig[environment]);
    }

    public setUpDatabase() {
        Model.knex(this.db);
    }
}
var environment = process.env.NODE_ENV || 'development';
export const knexQuery = <T>(table: keyof ITables) => knex(KnexConfig[environment]).from<T>(table);
import './paths';
import app from './app';
import PsqlConnection from "./database/connection";
class Main {
    private readonly db: PsqlConnection;

    constructor() {
        this.db =  new PsqlConnection();
    }

    public async init(): Promise<void> {
        this.db.setUpDatabase();
        await app.listen(app.get('port'));
        console.log("Server Listening on Port:", app.get("port"));
    }
}

new Main().init();
import postgres from "postgres";
import {NotificationRoles} from "../e2e/page-objects/helpers/enums/NotificationRoles.js";
import {dbConfig} from "./db.config.js";

export class DbHelper {
   public readonly sql: postgres.Sql<Record<string, postgres.PostgresType> extends {} ? {} : any>
    constructor() {
        this.sql = postgres(dbConfig)
    }
    /**
     * Create a user in 'work_users' table
     */
    public async insertUser(userId: number): Promise<void> {
        await this.sql`INSERT INTO rfsntf.work_users
                       (user_id,role_id,is_active)
                       VALUES
                       (${userId}, ${NotificationRoles.admin}, ${true})
                       on conflict do nothing`;
    }
    /**
     * Delete a user from 'work_users' and 'work_operation_log' tables
     */
    public async deleteUser(userId: number): Promise<void> {
        try {
            await this.sql`DELETE FROM rfsntf.work_operations_log
                           WHERE user_id = ${userId}`;
            await this.sql`DELETE FROM rfsntf.work_users
                           WHERE user_id = ${userId}`;
        }
        catch (err) {
            await this.deleteUser(userId);
        }
    }
    /**
     * Delete created modules
     */
    public async deleteModule(): Promise<void> {
        await this.sql`DELETE FROM rfsntf.nsi_rfs_modules
                       WHERE name LIKE 'автотест%'`;
    }
    /**
     * Close connect to databases
     */
    public async closeConnect(): Promise<void> {
        await this.sql.end();
    }
}
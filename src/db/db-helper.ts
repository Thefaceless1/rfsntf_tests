import postgres from "postgres";
import {modules, workOperationLog, workUsers} from "./tables.js";
import {NotificationRoles} from "../e2e/page-objects/helpers/enums/notification-roles.js";
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
        await this.sql`INSERT INTO ${this.sql(workUsers.tableName)}
                       (${this.sql(workUsers.columns.userId)},
                        ${this.sql(workUsers.columns.roleId)},
                        ${this.sql(workUsers.columns.isActive)})
                       VALUES
                       (${userId}, ${NotificationRoles.admin}, ${true})
                       on conflict do nothing`;
    }
    /**
     * Delete a user from 'work_users' and 'work_operation_log' tables
     */
    public async deleteUser(userId: number): Promise<void> {
        try {
            await this.sql`DELETE FROM ${this.sql(workOperationLog.tableName)}
                       WHERE ${this.sql(workOperationLog.columns.userId)} = ${userId}`;
            await this.sql`DELETE FROM ${this.sql(workUsers.tableName)}
                       WHERE ${this.sql(workUsers.columns.userId)} = ${userId}`;
        }
        catch (err) {
            await this.deleteUser(userId);
        }
    }
    /**
     * Delete created modules
     */
    public async deleteModule(): Promise<void> {
        await this.sql`DELETE FROM ${this.sql(modules.tableName)}
                       WHERE ${this.sql(modules.columns.name)} LIKE 'автотест%'`
    }
    /**
     * Close connect to databases
     */
    public async closeConnect(): Promise<void> {
        await this.sql.end();
    }
}
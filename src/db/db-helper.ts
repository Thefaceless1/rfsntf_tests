import postgres from "postgres";
import fs from "fs";
import {userNotifications, workOperationLog, workUsers} from "./tables.js";
import {NotificationRoles} from "../e2e/page-objects/helpers/enums/notification-roles.js";
import * as Process from "process";

export class DbHelper {
   public readonly sql : postgres.Sql<Record<string, postgres.PostgresType> extends {} ? {} : any>
    constructor() {
        this.sql = postgres(this.configData())
    }
    /**
     * test.db.config.json and prod.db.config.json file parser
     */
    public configData() : object {
       return (Process.env.BRANCH == "prod") ?
           JSON.parse(fs.readFileSync("./src/db/prod.db.config.json","utf-8")) :
           JSON.parse(fs.readFileSync("./src/db/test.db.config.json","utf-8"));
    }
    /**
     * Update is_received column(set false) in the user_notification table;
     */
    public async markAsUnreadMessages(userId : number) : Promise<void> {
        await this.sql`UPDATE ${this.sql(userNotifications.tableName)}
                       SET ${this.sql(userNotifications.columns.isReceived)} = false
                       WHERE ${this.sql(userNotifications.columns.userId)} = ${userId}`;
    }
    /**
     * Get notification user role Id
     */
    public async getUserRoleId(userId : number) : Promise<[{user_id : number}]> {
        return this.sql`SELECT ${this.sql(workUsers.columns.roleId)}
                        FROM ${this.sql(workUsers.tableName)}
                        WHERE ${this.sql(workUsers.columns.userId)} = ${userId}`;
    }
    /**
     * Create a user in 'work_users' table
     */
    public async insertUser(userId : number) : Promise<void> {
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
    public async deleteUser(userId : number) : Promise<void> {
        await this.sql`DELETE FROM ${this.sql(workOperationLog.tableName)}
                       WHERE ${this.sql(workOperationLog.columns.userId)} == ${userId}`;
        await this.sql`DELETE FROM ${this.sql(workUsers.tableName)}
                       WHERE ${this.sql(workUsers.columns.userId)} == ${userId}`;
    }
    /**
     * Set "Administrator" role for user
     */
    public async setAdminRole(userId : number) : Promise<void> {
        await this.sql`UPDATE ${this.sql(workUsers.tableName)}
                       SET ${this.sql(workUsers.columns.roleId)} = ${NotificationRoles.admin}
                       WHERE ${this.sql(workUsers.columns.userId)} = ${userId}`;
    }
    /**
     * Close connect to databases
     */
    public async closeConnect() : Promise<void> {
        await this.sql.end();
    }
}
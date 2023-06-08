import postgres from "postgres";
import fs from "fs";
import {userNotifications, workUsers} from "./tables.js";
import {NotificationRoles} from "../e2e/page-objects/helpers/enums/notification-roles.js";

export class DbHelper {
   public readonly sql : postgres.Sql<Record<string, postgres.PostgresType> extends {} ? {} : any>
    constructor() {
        this.sql = postgres(this.configData())
    }
    /**
     * license.db.config.json file parser
     */
    public configData() : object {
       return JSON.parse(fs.readFileSync("./src/db/db.config.json","utf-8"));
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
     * Create a user in the notification module system
     */
    public async insertNotificationUser(userId : number) : Promise<void> {
        await this.sql`INSERT INTO ${this.sql(workUsers.tableName)}
                          (${this.sql(workUsers.columns.userId)},
                           ${this.sql(workUsers.columns.roleId)},
                           ${this.sql(workUsers.columns.isActive)})
                          VALUES
                          (${userId}, ${NotificationRoles.admin}, ${true})`;
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
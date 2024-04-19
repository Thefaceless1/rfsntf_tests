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
    /**
     * Update 'is_answer' attribute for notification template
     */
    public async updateAnswerAttribute(notificationCode: string, isAnswer: boolean): Promise<void> {
        await this.sql`UPDATE rfsntf.nsi_message_templates
                       SET can_answer = ${isAnswer} 
                       WHERE code = ${notificationCode}`;
    }
    /**
     * Adding a user subscription to an email notification
     */
    public async addMailNotificationAttribute(notificationCode: string, userId: number): Promise<void> {
        await this.sql`UPDATE rfsntf.user_subscriptions
                       SET get_email = true
                       WHERE user_id = ${userId}
                       AND template_id = (SELECT id FROM rfsntf.nsi_message_templates WHERE code = ${notificationCode})`
    }
    /**
     * Getting secret key
     */
    public async getSecretKey(appId: string): Promise<string> {
        const secretKey = await this.sql`SELECT secret FROM rfsntf.nsi_rfs_apps
                                                                  WHERE app_id = ${appId}`;
        if(secretKey.length == 0) throw new Error(`Отсутствует секретный ключ для appId: ${appId}`);
        return secretKey[0].secret;
    }
    /**
     * Delete existing answers
     */
    public async deleteExistingAnswers(userId: number): Promise<void> {
        await this.sql`DELETE FROM rfsntf.user_answers
                       WHERE user_id = ${userId}`
    }
    /**
     * Get notification id by code
     */
    public async getNotificationId(notificationCode: string): Promise<number> {
        const result = await this.sql`SELECT id FROM rfsntf.nsi_message_templates WHERE code = ${notificationCode}`
        if(result.length == 0) throw new Error("Отсутствует уведомление с заданным кодом")
        return result[0].id;
    }
    /**
     * Get user answers
     */
    public async getUserAnswers(userId: number): Promise<postgres.PendingQuery<postgres.Row[]>> {
        return this.sql`SELECT * FROM rfsntf.user_answers
                       WHERE user_id = ${userId}`
    }
}
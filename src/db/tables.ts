export const workUsers = {
    tableName: "rfsntf.work_users",
    columns: {
        userId: "user_id",
        isActive: "is_active",
        roleId: "role_id"
    }
}
export const userNotifications = {
    tableName: "rfsntf.user_notifications",
    columns: {
        userId: "user_id",
        isReceived: "is_received"
    }
}
export const workOperationLog = {
    tableName: "rfsntf.work_operations_log",
    columns: {
        id: "id",
        userId: "user_id"
    }
}

export const modules = {
    tableName: "rfsntf.nsi_rfs_modules",
    columns: {
        id: "id",
        name: "name",
        description: "description",
        logo: "logo"
    }
}
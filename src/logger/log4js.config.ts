import log4js from "log4js";
import path from "path";

export const logsFilePath: string = path.resolve("src","e2e","artifacts","logs","rfsntf.log");
export const config: log4js.Configuration = {
    appenders: {
        file: {
            type: "file",
            filename: logsFilePath,
            flags: "w"
        },
        console: {type: "console"}
    },
    categories: {
        default: {
            appenders: ["file","console"],
            level: "info"
        }
    }
}
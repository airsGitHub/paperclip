import fs from "node:fs";
import type { PaperclipConfig } from "../config/schema.js";
import type { CheckResult } from "./index.js";
import { resolveRuntimeLikePath } from "./path-resolver.js";
import { t } from "../i18n/index.js";

export async function databaseCheck(config: PaperclipConfig, configPath?: string): Promise<CheckResult> {
  if (config.database.mode === "postgres") {
    if (!config.database.connectionString) {
      return {
        name: t("check_name_database"),
        status: "fail",
        message: t("db_msg_postgres_no_conn"),
        canRepair: false,
        repairHint: t("db_repair_hint"),
      };
    }

    try {
      const { createDb } = await import("@paperclipai/db");
      const db = createDb(config.database.connectionString);
      await db.execute("SELECT 1");
      return {
        name: t("check_name_database"),
        status: "pass",
        message: t("db_msg_postgres_ok"),
      };
    } catch (err) {
      return {
        name: t("check_name_database"),
        status: "fail",
        message: `${t("db_msg_postgres_fail")}: ${err instanceof Error ? err.message : String(err)}`,
        canRepair: false,
        repairHint: t("db_repair_hint"),
      };
    }
  }

  if (config.database.mode === "embedded-postgres") {
    const dataDir = resolveRuntimeLikePath(config.database.embeddedPostgresDataDir, configPath);
    const reportedPath = dataDir;
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(reportedPath, { recursive: true });
    }

    return {
      name: t("check_name_database"),
      status: "pass",
      message: t("db_msg_embedded_ok", { path: dataDir, port: config.database.embeddedPostgresPort }),
    };
  }

  return {
    name: t("check_name_database"),
    status: "fail",
    message: t("db_msg_unknown_mode", { mode: String(config.database.mode) }),
    canRepair: false,
    repairHint: t("db_repair_hint"),
  };
}

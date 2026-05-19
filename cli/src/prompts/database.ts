import * as p from "@clack/prompts";
import type { DatabaseConfig } from "../config/schema.js";
import {
  resolveDefaultBackupDir,
  resolveDefaultEmbeddedPostgresDir,
  resolvePaperclipInstanceId,
} from "../config/home.js";
import { t } from "../i18n/index.js";

export async function promptDatabase(current?: DatabaseConfig): Promise<DatabaseConfig> {
  const instanceId = resolvePaperclipInstanceId();
  const defaultEmbeddedDir = resolveDefaultEmbeddedPostgresDir(instanceId);
  const defaultBackupDir = resolveDefaultBackupDir(instanceId);
  const base: DatabaseConfig = current ?? {
    mode: "embedded-postgres",
    embeddedPostgresDataDir: defaultEmbeddedDir,
    embeddedPostgresPort: 54329,
    backup: {
      enabled: true,
      intervalMinutes: 60,
      retentionDays: 30,
      dir: defaultBackupDir,
    },
  };

  const mode = await p.select({
    message: t("prompt_db_mode"),
    options: [
      { value: "embedded-postgres" as const, label: t("prompt_db_mode_embedded_label"), hint: t("prompt_db_mode_embedded_hint") },
      { value: "postgres" as const, label: t("prompt_db_mode_external_label") },
    ],
    initialValue: base.mode,
  });

  if (p.isCancel(mode)) {
    p.cancel(t("prompt_cancelled"));
    process.exit(0);
  }

  let connectionString: string | undefined = base.connectionString;
  let embeddedPostgresDataDir = base.embeddedPostgresDataDir || defaultEmbeddedDir;
  let embeddedPostgresPort = base.embeddedPostgresPort || 54329;

  if (mode === "postgres") {
    const value = await p.text({
      message: t("prompt_db_conn_string"),
      defaultValue: base.connectionString ?? "",
      placeholder: "postgres://user:pass@localhost:5432/paperclip",
      validate: (val) => {
        if (!val) return t("validate_required");
        if (!val.startsWith("postgres")) return t("validate_postgres_url");
      },
    });

    if (p.isCancel(value)) {
      p.cancel(t("prompt_cancelled"));
      process.exit(0);
    }

    connectionString = value;
  } else {
    const dataDir = await p.text({
      message: t("prompt_db_data_dir"),
      defaultValue: base.embeddedPostgresDataDir || defaultEmbeddedDir,
      placeholder: defaultEmbeddedDir,
    });

    if (p.isCancel(dataDir)) {
      p.cancel(t("prompt_cancelled"));
      process.exit(0);
    }

    embeddedPostgresDataDir = dataDir || defaultEmbeddedDir;

    const portValue = await p.text({
      message: t("prompt_db_port"),
      defaultValue: String(base.embeddedPostgresPort || 54329),
      placeholder: "54329",
      validate: (val) => {
        const n = Number(val);
        if (!Number.isInteger(n) || n < 1 || n > 65535) return t("validate_port_range");
      },
    });

    if (p.isCancel(portValue)) {
      p.cancel(t("prompt_cancelled"));
      process.exit(0);
    }

    embeddedPostgresPort = Number(portValue || "54329");
    connectionString = undefined;
  }

  const backupEnabled = await p.confirm({
    message: t("prompt_db_backup_enable"),
    initialValue: base.backup.enabled,
  });
  if (p.isCancel(backupEnabled)) {
    p.cancel(t("prompt_cancelled"));
    process.exit(0);
  }

  const backupDirInput = await p.text({
    message: t("prompt_db_backup_dir"),
    defaultValue: base.backup.dir || defaultBackupDir,
    placeholder: defaultBackupDir,
    validate: (val) => (!val || val.trim().length === 0 ? "Backup directory is required" : undefined),
  });
  if (p.isCancel(backupDirInput)) {
    p.cancel(t("prompt_cancelled"));
    process.exit(0);
  }

  const backupIntervalInput = await p.text({
    message: t("prompt_db_backup_interval"),
    defaultValue: String(base.backup.intervalMinutes || 60),
    placeholder: "60",
    validate: (val) => {
      const n = Number(val);
      if (!Number.isInteger(n) || n < 1) return t("validate_interval_range");
      if (n > 10080) return t("validate_interval_range");
      return undefined;
    },
  });
  if (p.isCancel(backupIntervalInput)) {
    p.cancel(t("prompt_cancelled"));
    process.exit(0);
  }

  const backupRetentionInput = await p.text({
    message: t("prompt_db_backup_retention"),
    defaultValue: String(base.backup.retentionDays || 30),
    placeholder: "30",
    validate: (val) => {
      const n = Number(val);
      if (!Number.isInteger(n) || n < 1) return t("validate_retention_range");
      if (n > 3650) return t("validate_retention_range");
      return undefined;
    },
  });
  if (p.isCancel(backupRetentionInput)) {
    p.cancel(t("prompt_cancelled"));
    process.exit(0);
  }

  return {
    mode,
    connectionString,
    embeddedPostgresDataDir,
    embeddedPostgresPort,
    backup: {
      enabled: backupEnabled,
      intervalMinutes: Number(backupIntervalInput || "60"),
      retentionDays: Number(backupRetentionInput || "30"),
      dir: backupDirInput || defaultBackupDir,
    },
  };
}

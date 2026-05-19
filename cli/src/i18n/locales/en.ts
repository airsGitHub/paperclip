export const en = {
  // banner
  tagline: "Open-source orchestration for zero-human companies",

  // cli index - descriptions
  cli_desc: "Paperclip CLI — setup, diagnose, and configure your instance",
  cmd_onboard_desc: "Interactive first-run setup wizard",
  cmd_doctor_desc: "Run diagnostic checks on your Paperclip setup",
  cmd_env_desc: "Print environment variables for deployment",
  cmd_configure_desc: "Update configuration sections",
  cmd_db_backup_desc: "Create a one-off database backup using current config",
  cmd_allowed_hostname_desc: "Allow a hostname for authenticated/private mode access",
  cmd_run_desc: "Bootstrap local setup (onboard + doctor) and run Paperclip",
  cmd_heartbeat_desc: "Heartbeat utilities",
  cmd_heartbeat_run_desc: "Run one agent heartbeat and stream live logs",
  cmd_auth_desc: "Authentication and bootstrap utilities",
  cmd_auth_bootstrap_ceo_desc: "Create a one-time bootstrap invite URL for first instance admin",
  opt_data_dir_help: "Paperclip data directory root (isolates state from ~/.paperclip)",

  // doctor
  doctor_title: " paperclip doctor ",
  doctor_summary_all_passed: "All checks passed",
  doctor_summary_with_issues: "Checks completed with issues",
  doctor_repair_prompt: 'Repair "{name}"?',
  doctor_repairing: "Attempting repairs...",
  doctor_repair_complete: "Repair complete. Re-running checks...",
  doctor_repaired: "Repaired: {name}",
  doctor_repair_failed: "Repair failed: {msg}",
  doctor_summary_note: "Summary",
  doctor_outro_failed: "Some checks failed. Fix the issues above and re-run doctor.",
  doctor_outro_warned: "All critical checks passed with some warnings.",
  doctor_outro_passed: "All checks passed!",

  // checks - common
  check_name_database: "Database",
  check_name_config: "Config",
  check_name_config_file: "Config file",
  check_name_deployment_auth: "Deployment / Auth",
  check_name_agent_jwt: "Agent JWT Secret",
  check_name_secrets: "Secrets adapter",
  check_name_storage: "Storage adapter",
  check_name_llm: "LLM configuration",
  check_name_logs: "Log directory",
  check_name_port: "Server port",

  // checks - messages
  db_msg_postgres_no_conn: "PostgreSQL mode selected but no connection string configured",
  db_msg_postgres_ok: "PostgreSQL connection successful",
  db_msg_postgres_fail: "Cannot connect to PostgreSQL",
  db_msg_embedded_ok: "Embedded PostgreSQL configured at {path} (port {port})",
  db_msg_unknown_mode: "Unknown database mode: {mode}",
  db_repair_hint: "Run `paperclipai configure --section database`",
  cfg_msg_not_found: "Config file not found",
  cfg_repair_hint: "Run `paperclipai onboard` to create one",
  cfg_msg_read_error: "Could not read config: {msg}",

  // prompts - database
  prompt_db_mode: "Database mode",
  prompt_db_mode_embedded_label: "Embedded PostgreSQL (managed locally)",
  prompt_db_mode_embedded_hint: "recommended",
  prompt_db_mode_external_label: "PostgreSQL (external server)",
  prompt_db_conn_string: "PostgreSQL connection string",
  prompt_db_data_dir: "Embedded PostgreSQL data directory",
  prompt_db_port: "Embedded PostgreSQL port",
  prompt_db_backup_enable: "Enable automatic database backups?",
  prompt_db_backup_dir: "Backup directory",
  prompt_db_backup_interval: "Backup interval (minutes)",
  prompt_db_backup_retention: "Backup retention (days)",
  prompt_cancelled: "Setup cancelled.",
  validate_required: "This field is required",
  validate_port_range: "Port must be an integer between 1 and 65535",
  validate_interval_range: "Interval must be a positive integer and at most 10080 (7 days)",
  validate_retention_range: "Retention must be a positive integer and at most 3650 days",
  validate_postgres_url: "Must be a postgres:// or postgresql:// URL",
  validate_backup_dir_required: "Backup directory is required",
} as const;

export type I18nKey = keyof typeof en;

import { Command } from "commander";
import { onboard } from "./commands/onboard.js";
import { doctor } from "./commands/doctor.js";
import { envCommand } from "./commands/env.js";
import { configure } from "./commands/configure.js";
import { addAllowedHostname } from "./commands/allowed-hostname.js";
import { heartbeatRun } from "./commands/heartbeat-run.js";
import { runCommand } from "./commands/run.js";
import { bootstrapCeoInvite } from "./commands/auth-bootstrap-ceo.js";
import { dbBackupCommand } from "./commands/db-backup.js";
import { registerEnvLabCommands } from "./commands/env-lab.js";
import { registerContextCommands } from "./commands/client/context.js";
import { registerCompanyCommands } from "./commands/client/company.js";
import { registerIssueCommands } from "./commands/client/issue.js";
import { registerAgentCommands } from "./commands/client/agent.js";
import { registerApprovalCommands } from "./commands/client/approval.js";
import { registerActivityCommands } from "./commands/client/activity.js";
import { registerDashboardCommands } from "./commands/client/dashboard.js";
import { registerRoutineCommands } from "./commands/routines.js";
import { registerFeedbackCommands } from "./commands/client/feedback.js";
import { registerSecretCommands } from "./commands/client/secrets.js";
import { applyDataDirOverride, type DataDirOptionLike } from "./config/data-dir.js";
import { loadPaperclipEnvFile } from "./config/env.js";
import { initTelemetryFromConfigFile, flushTelemetry } from "./telemetry.js";
import { registerWorktreeCommands } from "./commands/worktree.js";
import { registerPluginCommands } from "./commands/client/plugin.js";
import { registerClientAuthCommands } from "./commands/client/auth.js";
import { cliVersion } from "./version.js";
import { t, setLanguage } from "./i18n/index.js";

const program = new Command();
const DATA_DIR_OPTION_HELP = t("opt_data_dir_help");

program
  .name("paperclipai")
  .description(t("cli_desc"))
  .version(cliVersion)
  .option("--lang <lang>", "UI language (en, zh-CN, ja-JP)", "en");

program.hook("preAction", (thisCommand, actionCommand) => {
  const globalOpts = thisCommand.opts() as { lang?: string };
  if (globalOpts.lang) {
    setLanguage(globalOpts.lang);
  }

  const options = actionCommand.optsWithGlobals() as DataDirOptionLike;
  const optionNames = new Set(actionCommand.options.map((option) => option.attributeName()));
  applyDataDirOverride(options, {
    hasConfigOption: optionNames.has("config"),
    hasContextOption: optionNames.has("context"),
  });
  loadPaperclipEnvFile(options.config);
  initTelemetryFromConfigFile(options.config);
});

program
  .command("onboard")
  .description(t("cmd_onboard_desc"))
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("--bind <mode>", "Quickstart reachability preset (loopback, lan, tailnet)")
  .option("-y, --yes", "Accept quickstart defaults (trusted local loopback unless --bind is set) and start immediately", false)
  .option("--run", "Start Paperclip immediately after saving config", false)
  .action(onboard);

program
  .command("doctor")
  .description(t("cmd_doctor_desc"))
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("--repair", "Attempt to repair issues automatically")
  .alias("--fix")
  .option("-y, --yes", "Skip repair confirmation prompts")
  .action(async (opts) => {
    await doctor(opts);
  });

program
  .command("env")
  .description(t("cmd_env_desc"))
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .action(envCommand);

program
  .command("configure")
  .description(t("cmd_configure_desc"))
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("-s, --section <section>", "Section to configure (llm, database, logging, server, storage, secrets)")
  .action(configure);

program
  .command("db:backup")
  .description(t("cmd_db_backup_desc"))
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("--dir <path>", "Backup output directory (overrides config)")
  .option("--retention-days <days>", "Retention window used for pruning", (value) => Number(value))
  .option("--filename-prefix <prefix>", "Backup filename prefix", "paperclip")
  .option("--json", "Print backup metadata as JSON")
  .action(async (opts) => {
    await dbBackupCommand(opts);
  });

program
  .command("allowed-hostname")
  .description(t("cmd_allowed_hostname_desc"))
  .argument("<host>", "Hostname to allow (for example dotta-macbook-pro)")
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .action(addAllowedHostname);

program
  .command("run")
  .description(t("cmd_run_desc"))
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("-i, --instance <id>", "Local instance id (default: default)")
  .option("--bind <mode>", "On first run, use onboarding reachability preset (loopback, lan, tailnet)")
  .option("--repair", "Attempt automatic repairs during doctor", true)
  .option("--no-repair", "Disable automatic repairs during doctor")
  .action(runCommand);

const heartbeat = program.command("heartbeat").description(t("cmd_heartbeat_desc"));

heartbeat
  .command("run")
  .description(t("cmd_heartbeat_run_desc"))
  .requiredOption("-a, --agent-id <agentId>", "Agent ID to invoke")
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("--context <path>", "Path to CLI context file")
  .option("--profile <name>", "CLI context profile name")
  .option("--api-base <url>", "Base URL for the Paperclip server API")
  .option("--api-key <token>", "Bearer token for agent-authenticated calls")
  .option(
    "--source <source>",
    "Invocation source (timer | assignment | on_demand | automation)",
    "on_demand",
  )
  .option("--trigger <trigger>", "Trigger detail (manual | ping | callback | system)", "manual")
  .option("--timeout-ms <ms>", "Max time to wait before giving up", "0")
  .option("--json", "Output raw JSON where applicable")
  .option("--debug", "Show raw adapter stdout/stderr JSON chunks")
  .action(heartbeatRun);

registerContextCommands(program);
registerCompanyCommands(program);
registerIssueCommands(program);
registerAgentCommands(program);
registerApprovalCommands(program);
registerActivityCommands(program);
registerDashboardCommands(program);
registerRoutineCommands(program);
registerFeedbackCommands(program);
registerSecretCommands(program);
registerWorktreeCommands(program);
registerEnvLabCommands(program);
registerPluginCommands(program);

const auth = program.command("auth").description(t("cmd_auth_desc"));

auth
  .command("bootstrap-ceo")
  .description(t("cmd_auth_bootstrap_ceo_desc"))
  .option("-c, --config <path>", "Path to config file")
  .option("-d, --data-dir <path>", DATA_DIR_OPTION_HELP)
  .option("--force", "Create new invite even if admin already exists", false)
  .option("--expires-hours <hours>", "Invite expiration window in hours", (value) => Number(value))
  .option("--base-url <url>", "Public base URL used to print invite link")
  .action(bootstrapCeoInvite);

registerClientAuthCommands(auth);

async function main(): Promise<void> {
  let failed = false;
  try {
    await program.parseAsync();
  } catch (err) {
    failed = true;
    console.error(err instanceof Error ? err.message : String(err));
  } finally {
    await flushTelemetry();
  }

  if (failed) {
    process.exit(1);
  }
}

void main();

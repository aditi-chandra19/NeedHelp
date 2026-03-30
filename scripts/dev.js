import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const children = [];
let isShuttingDown = false;

function getNpmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function getSpawnConfig(args) {
  if (process.platform === "win32") {
    return {
      command: "cmd.exe",
      commandArgs: ["/d", "/s", "/c", `${getNpmCommand()} ${args.join(" ")}`],
    };
  }

  return {
    command: getNpmCommand(),
    commandArgs: args,
  };
}

function startProcess(name, workdir, args, color) {
  const { command, commandArgs } = getSpawnConfig(args);

  const child = spawn(command, commandArgs, {
    cwd: workdir,
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
  });

  const prefix = `\u001b[${color}m[${name}]\u001b[0m`;

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`${prefix} ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`${prefix} ${chunk}`);
  });

  child.on("exit", (code) => {
    if (isShuttingDown) {
      return;
    }

    if (code !== 0) {
      console.error(`${prefix} exited with code ${code}`);
      shutdown(code ?? 1);
    }
  });

  children.push(child);
}

function shutdown(exitCode = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => {
    process.exit(exitCode);
  }, 300);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

startProcess("server", resolve(rootDir, "server"), ["run", "dev"], "36");
startProcess("client", resolve(rootDir, "client"), ["run", "dev"], "35");

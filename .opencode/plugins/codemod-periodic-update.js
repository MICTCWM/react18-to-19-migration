export async function CodemodPeriodicUpdate() {
  const runnerPath = "F:\\code\\dorahacks\\react18-to-19-migration\\.opencode\\codemod/periodic-update\\check-updates.sh";
  return {
    event: async ({ event, $ }) => {
      if (event?.type !== "session.idle") {
        return;
      }

      try {
        await $`sh ${runnerPath}`;
      } catch {
        // Best-effort only: keep startup non-blocking.
      }
    },
  };
}

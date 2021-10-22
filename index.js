const core = require('@actions/core');
const github = require('@actions/github');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(GITHUB_TOKEN);

    const context = github.context;

    const artifacts = await octokit.rest.actions.listWorkflowRunArtifacts({
      owner: context.repo.owner,
      repo: context.repo.repo,
      run_id: context.workflow_run.id,
    });

    console.log(artifacts);
    console.log(context);
    console.log(JSON.stringify(context, null, 2));

    const prefix = core.getInput('prefix');
    const suffix = core.getInput('suffix');

    const message = `
      ${prefix}
      Artifacts: ${artifacts.data.artifacts.map(artifact => {
        return `${artifact.name}: [Download](${artifact.archive_download_url})`;
      })}
      ${suffix}
    `;
    core.info(message);
    core.setOutput('message', message);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

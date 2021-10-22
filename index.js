const core = require('@actions/core');
const github = require('@actions/github');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const octokit = github.getOctokit(GITHUB_TOKEN);

    const context = github.context;

    console.log(context.repo);
    console.log(context.repository);

    const artifacts = await octokit.rest.actions.listWorkflowRunArtifacts({
      owner: context.repository.owner,
      repo: context.repo.repo,
      run_id: context.runId,
    });

    console.log(context);
    console.log(JSON.stringify(context, null, 2));
    console.log(artifacts);

    const prefix = core.getInput('prefix');
    const suffix = core.getInput('suffix');
    core.info(`${prefix} ${suffix}`);

    const message = `
      ${prefix}
      Artifacts:
      ${suffix}
    `;

    core.setOutput('message', message);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

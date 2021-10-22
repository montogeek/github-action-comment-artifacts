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
      run_id: context.payload.workflow_run.id,
    });

    const prefix = core.getInput('prefix');
    const suffix = core.getInput('suffix');

    const message = `
      ${prefix}
      Artifacts: ${artifacts.data.artifacts.map(artifact => {
        return `${artifact.name}: [Download](https://github.com/${context.repo.owner}/${context.repo.repo}/suites/${context.payload.workflow_run.check_suite_id}/artifacts/${artifact.id})`;
      })}
      ${suffix}
    `;
    core.info(message);

    console.log(context.payload.workflow_run);
    console.log(context.payload.workflow_run.pull_requests);

    const { data: comment } = await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.workflow_run.pull_requests[0].number,
      body: message,
    });
    core.info(
      `Created comment id '${comment.id}' on issue '${context.payload.workflow_run.pull_requests[0].number}'.`
    );
    core.setOutput('message', message);
  } catch (error) {
    core.info(error);
    core.setFailed(error.message);
  }
}

run();

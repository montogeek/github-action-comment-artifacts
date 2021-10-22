const core = require('@actions/core');
const github = require('@actions/github');
const artifact = require('@actions/artifact');
const artifactClient = artifact.create();

// most @actions toolkit packages have async methods
async function run() {
  try {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    // const octokit = github.getOctokit(GITHUB_TOKEN);

    const context = github.context;

    // octokit.rest.actions.listWorkflowRunArtifacts({
    //   owner: context.repo.owner,
    //   repo: context.repo.repo,
    // });

    console.log(context);
    const downloadResponse = await artifactClient.downloadAllArtifacts();

    // output result
    for (let response in downloadResponse) {
      console.log(response.artifactName);
      console.log(response.downloadPath);
    }

    const prefix = core.getInput('prefix');
    const suffix = core.getInput('suffix');
    core.info(`${prefix} ${suffix}`);

    const message = `
      ${prefix}
      Artifacts:
      ${suffix}
    `

    core.setOutput('message', message);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

import packageJson from '../../package.json';
export const environment = {
  version: packageJson.version,
  branchName:'UnknownBranchName',
  commitId:'UnknownCommitId',
  production: true,
  host: "http://localhost:8080/api"
};

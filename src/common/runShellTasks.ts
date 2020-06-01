import child_process from 'child_process';
import { shellResults } from '../renderer/App.d'

const runDockerComposeDeployment = (filePath: string) => 
  runShell(`docker-compose -f ${filePath} up`);


const runDockerComposeValidation = (filePath: string) => 
  runShell(`docker-compose -f ${filePath} config`);

const runShell = (cmd: string) =>
  // promise for the electron application
  new Promise((resolve, reject) => {
    try {
      // run docker's validation command in a bash shell
      console.log('cmd', cmd);
      child_process.exec(
        cmd,
        // callback function to access output of docker-compose command
        (error, stdout, stderr) => {
          // add output to object
          const shellResult: shellResults = {
            out: stdout.toString(),
            envResolutionRequired: false,
          };
          // if there is an error, add the error object to validationResult obj
          if (error) {
            //if docker-compose uses env file to run, store this variable to handle later
            if (error.message.includes('variable is not set')) {
              shellResult.envResolutionRequired = true;
            }
            // filter errors we don't care about
            if (
              !error.message.includes("Couldn't find env file") &&
              !error.message.includes(
                'either does not exist, is not accessible',
              ) &&
              !error.message.includes('variable is not set')
            ) {
              shellResult.error = error;
            }
          }
          // resolve promise when shell command finishes
          resolve(shellResult);
        },
      );
    } catch {}
  });

  export default runShell;
  export { runDockerComposeDeployment, runDockerComposeValidation };
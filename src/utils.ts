const node_utils = require('node:util');
const execFile = node_utils.promisify(require('node:child_process').execFile);

function execFileReverseExit(filePath: string, ...args: string[]): Promise<string>
{
    return new Promise((resolve, reject) => {
        execFile(filePath, args, (error: { code: number; }, stdout: string, stderr: string) => {
          if (error) {
            if (error.code >= 1) {
              resolve(stdout);
            } else {
              reject(error);
            }
          } else {
            resolve(stdout);
          }
        });
      });
}

export {execFileReverseExit}
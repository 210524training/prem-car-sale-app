import readline from 'readline';

export const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function exit() {
  read.close();
  process.exit(0);
}

// eslint-disable-next-line max-len
export function questionFunc(question: string, isValid?: (answer: string) => boolean): Promise<string> {
  return new Promise<string>(
    (resolve, reject) => {
      read.question(question, (answer) => {
        if(!isValid) {
          resolve(answer);
          return;
        }

        if(isValid(answer)) {
          resolve(answer);
        }

        reject(new Error(`${answer} in invalid based on ${isValid}`));
      });
    },
  );
}

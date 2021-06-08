import log from './log';
import { receiveUserSelection } from './services/menu/menu';

async function start() {
  // eslint-disable-next-line no-constant-condition
  while(true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await receiveUserSelection();
    } catch(error) {
      log.debug(error);
    }
  }
}

start();

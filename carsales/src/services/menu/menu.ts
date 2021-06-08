import Lot from '../inventory/lot';
import { exit } from '../../readline-input/readlineService';
import {
  customerPrompt, employeePrompt, guestPrompt,
} from '../prompts/prompts';
import userService from '../user/userService';
import User from '../../models/user';

let loginUser: User | undefined;

// eslint-disable-next-line import/prefer-default-export
export async function receiveUserSelection(): Promise<void> {
  let response: string;
  if(!loginUser) {
    response = await guestPrompt();

    switch (response) {
    case '0':
      await userService.attemptRegister();
      break;
    case '1':
      loginUser = await userService.attemptLogin();
      break;
    case '2':
      await Lot.seeLot();
      break;
    default:
      exit();
    }
  } else if(loginUser.role === 'Customer') {
    response = await customerPrompt();

    switch (response) {
    case '0':
      await userService.ownedCars();
      break;
    case '1':
      await Lot.seeLot();
      break;
    case '2':
      await userService.userOffer();
      break;
    case '3':
      await userService.getRemainingPay(loginUser.username);
      break;
    default:
      exit();
    }
  } else if(loginUser.role === 'Employee') {
    response = await employeePrompt();

    switch (response) {
    case '0':
      await Lot.seeLot();
      break;
    case '1':
      await Lot.addToLot();
      break;
    case '2':
      await Lot.delCar();
      break;
    case '3':
      await userService.getAllRemPay();
      break;
    case '4':
      await userService.seeOffers();
      break;
    case '5':
      await userService.offerAccept();
      break;
    case '6':
      await userService.offerReject();
      break;
    default:
      exit();
    }
  }
}

import User from '../../models/user';
import userDAO from '../../DAO/userDAO';
import offerDAO from '../../DAO/offerDAO';
import carDAO from '../../DAO/carsDAO';
import {
  getUsername, getPassword, getId, getCarOffer,
} from '../prompts/prompts';
import { registerPassword } from '../input/input';
import Offer from '../../models/offer';

export class UserService {
  public loginUser: User | undefined;

  public users = userDAO;

  public offers = offerDAO;

  public cars = carDAO;

  async register(loginUser: User): Promise<void> {
    await this.users.addUser(loginUser);
  }

  async attemptRegister(): Promise<void> {
    const username = await getUsername();
    const checkUser = await this.users.findByUsername(username);

    if(!checkUser) {
      console.log('This username is already taken!');
      throw new Error('Username Taken');
    }
    const password = await registerPassword();
    await this.register(new User(username, password, 'Customer'));
  }

  async login(username: string, password: string): Promise<User | undefined> {
    let found: User | undefined;
    try {
      found = await this.users.findByUsername(username);
      if(found?.username === username && found?.password === password) {
        return found;
      }
    } catch(err) {
      throw new Error('Invalid username or password');
    }
    return undefined;
  }

  async attemptLogin(): Promise<User | undefined> {
    const username = await getUsername();
    const password = await getPassword();

    const accept = await this.login(username, password);

    if(accept) {
      console.log('Successfully logged in,');
      this.loginUser = accept;
      return this.loginUser;
    }
    console.log('Incorrect login credentials.');
    return undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  async monthlyPay(pay: number): Promise<number> {
    return pay / 12;
  }

  // eslint-disable-next-line class-methods-use-this
  async remainingPay(): Promise<number> {
    return 12;
  }

  async userOffer(): Promise<void> {
    const carId = await getId();
    const username = await getUsername();
    const carOffer = await getCarOffer();
    const remainingPay = await this.remainingPay();
    const monthlyPay = await this.monthlyPay(carOffer);
    const offerStatus = 'Reviewing';
    const newOffer = new Offer(
      carOffer, carId, username, remainingPay, monthlyPay, offerStatus,
    );
    console.log('offer sent.');
    await this.offers.newOffer(newOffer);
  }

  async seeOffers(): Promise<void> {
    const carOffer = await this.offers.retrievePendingOffer();
    carOffer.forEach((offer) => {
      console.log(
        `Offer Amount: ${offer.carOffer}
        Car id: ${offer.carId}
        Username: ${offer.username}
        Monthly Payments: ${offer.monthlyPay}
        Remaining Payments: ${offer.remainingPay}
      `,
      );
    });
  }

  async offerAccept(): Promise<void> {
    const carId = await getId();
    const owner = await getUsername();

    await this.offers.updateAccept(carId);
    await this.cars.updateOwner(owner, carId);
    await this.rejectAllPendingOffers(carId);
    console.log('Offer Accepted.');
  }

  async rejectAllPendingOffers(carId: number): Promise<void> {
    const reject = await this.offers.scanPendingOffers(carId);
    reject.forEach(async (item) => {
      await this.offers.updateReject(item.carId);
    });
  }

  async offerReject(): Promise<void> {
    const carId = await getId();

    await this.offers.updateReject(carId);
    console.log('Offer Rejected.');
  }

  async ownedCars(): Promise<void> {
    const username = await getUsername();
    const cars = await this.cars.getByOwner(username);
    cars.forEach((item) => {
      console.log(`
        Id: ${item.id}
        Make: ${item.make}
        Model: ${item.model}
        Color: ${item.color}
        Year: ${item.year}
        Mileage: ${item.mileage}
        Owner: ${item.owner}
      `);
    });
  }

  async getRemainingPay(user: string): Promise<void> {
    const cars = await this.offers.queryCars(user);
    if(cars.length === 0) {
      console.log('No payments remaining.');
    } else {
      cars.forEach((item) => {
        console.log(`
        Car Id: ${item.carId}
        Remaining Payments: ${item.remainingPay}
        Monthly Payments: ${item.monthlyPay}
        `);
      });
    }
  }

  async getAllRemPay(): Promise<void> {
    const cars = await this.offers.queryAllCars();
    if(cars.length === 0) {
      console.log('No payments remaining.');
    } else {
      cars.forEach((item) => {
        console.log(`
        Username: ${item.username}
        Car Id: ${item.carId}
        Remaining Payments: ${item.remainingPay}
        Monthly Payments: ${item.monthlyPay}
        `);
      });
    }
  }

  logout(): void {
    this.loginUser = undefined;
  }
}

export default new UserService();

import CarDAO from '../../DAO/carsDAO';
import Car from '../../models/car';
import {
  getColor, getMake, getModel, getYear, getMileage, getStartPrice, getId,
} from '../prompts/prompts';

export function carString(car: Car) {
  return `${car.id} | ${car.make} | ${car.model} | ${car.color} | ${car.year} | 
  ${car.mileage} | ${car.price}`;
}

class Lot {
  constructor(
    public cars = CarDAO,
  ) {}

  async addToLot(): Promise<void> {
    const make = await getMake();
    const model = await getModel();
    const color = await getColor();
    const year = await getYear();
    const mileage = await getMileage();
    const price = await getStartPrice();
    const newCar = new Car(
      Math.floor(Math.random() * 100000 + 1),
      make, model, color, year, mileage, price, 'On Sale',
    );
    await this.cars.addCar(newCar);
  }

  async delCar(): Promise<void> {
    const carId = await getId();
    const inLot = await this.cars.removeCar(carId);
    if(inLot) {
      console.log('Car removed.');
    } else {
      console.log('Car not located.');
    }
  }

  async seeLot(): Promise<void> {
    const vehicle = await this.cars.viewAll();
    vehicle.forEach((item) => {
      carString(item);
    });
  }
}

export default new Lot();

import Car from '../../models/car';
import {
  getPassword, confirmPassword, getMake, getModel, getColor, getYear,
  getMileage, getStartPrice,
} from '../prompts/prompts';

export async function registerPassword(): Promise<string> {
  const password = await getPassword();

  if(await confirmPassword(password)) {
    return password;
  }

  console.log('Password did not match');
  throw new Error('Password did not match');
}

export async function getCar(): Promise<Car> {
  const make = await getMake();
  const model = await getModel();
  const color = await getColor();
  const year = await getYear();
  const mileage = await getMileage();
  const price = await getStartPrice();
  const owner = 'On Sale';

  return new Car(
    Math.floor(Math.random() * 90000) + 10000, make, model, color, year, mileage, price, owner,
  );
}

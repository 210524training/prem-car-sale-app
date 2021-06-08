/* eslint-disable no-tabs */
import { questionFunc } from '../../readline-input/readlineService';

export function guestPrompt(): Promise<string> {
  return questionFunc(
    `Select an option from the menu:
			0: Register
			1: Login
			2: View Cars
			q: Close Application\n`,
    (answer) => ['0', '1', '2', 'q'].includes(answer),
  );
}
export function customerPrompt(): Promise<string> {
  return questionFunc(
    `Pick an option below:
			0: View cars owned
			1: View cars on lot
			2: Make an offer on a car
			3: View remaining payments
			q: Exit Application\n`,
    (answer) => ['0', '1', '2', '3', 'q'].includes(answer),
  );
}

export function employeePrompt(): Promise<string> {
  return questionFunc(
    `Select an action:
      0: View all cars
      1: Add a car
      2: Remove a car
      3: View all car payments
      4: View offers
      5: Accept an offers
      6: Decline an offer
      q: Exit Application\n`,
    (answer) => ['0', '1', '2', '3', '4', '5', '6', 'q'].includes(answer),
  );
}

export function getUsername(): Promise<string> {
  return questionFunc('What is your username?');
}

export function getPassword(): Promise<string> {
  return questionFunc('What is your password?');
}

export async function confirmPassword(password: string): Promise<boolean> {
  const answer = await questionFunc('Please re-type your password: ');

  return answer === password;
}

export async function getId(): Promise<number> {
  const response = await questionFunc(
    'Enter the car ID number: ', (answer) => Number.isInteger(Number(answer)) && Number(answer) >= 1000,
  );
  return Number(response);
}

export async function getMake(): Promise<string> {
  return questionFunc('Enter the make of the car: ');
}

export async function getModel(): Promise<string> {
  return questionFunc('Enter the car model: ');
}

export async function getColor(): Promise<string> {
  return questionFunc('Enter the car color: ');
}

export async function getYear(): Promise<number> {
  const response = await questionFunc(
    'Enter the year: ', (answer) => Number.isInteger(Number(answer)) && Number(answer) >= 0,
  );
  return Number(response);
}

export async function getMileage(): Promise<number> {
  const response = await questionFunc(
    'Enter the mileage: ', (answer) => Number.isInteger(Number(answer)) && Number(answer) >= 0,
  );
  return Number(response);
}

export async function getStartPrice(): Promise<number> {
  const response = await questionFunc(
    'Enter the starting price: ', (answer) => Number.isInteger(Number(answer)) && Number(answer) >= 0,
  );
  return Number(response);
}

export async function getCarOffer(): Promise<number> {
  const response = await questionFunc(
    'Enter and offer: ', (answer) => Number.isInteger(Number(answer)) && Number(answer) >= 0,
  );
  return Number(response);
}

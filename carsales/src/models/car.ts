/* eslint-disable no-tabs */
// id
// make
// model
// color
// year
// mileage
// price
// owner

export default class Car {
  constructor(
		public id: number = Math.floor(Math.random() * 90000) + 10000,
		public make: string,
		public model: string,
		public color: string,
		public year: number,
		public mileage: number,
		public price: number,
		public owner: string,
  ) {}
}

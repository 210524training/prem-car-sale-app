// car id
// username
// offer

export default class Offer {
  constructor(
    public carOffer: number,
    public carId: number,
    public username: string,
    public remainingPay: number,
    public monthlyPay: number,
    public offerStatus: 'Reviewing' | 'Accepted' | 'Rejected',
  ) {}
}

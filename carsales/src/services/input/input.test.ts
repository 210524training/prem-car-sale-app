import * as input from './input';

describe('Input', () => {
  afterAll(() => {
    input.read.close();
  });

  describe('guestPrompt', () => {
    test('resolve with answer given valid input', async () => {
      const responses = ['0', '1', '2', 'q'];
      const randomNumber = Math.floor(Math.random() * responses.length);
      const validInput = responses[randomNumber];

      input.read.question = jest.fn().mockImplementationOnce(
        (questionText, answer) => answer(validInput),
      );

      await expect(input.guestPrompt()).resolves.toBe(validInput);
    });

    test('reject invalid input', async () => {
      const randomLength = Math.floor(Math.random() * 5 + 2);

      const invalidInput = Math.random().toString(36).substring(randomLength);

      input.read.question = jest.fn().mockImplementationOnce(
        (questionText, answer) => answer(invalidInput),
      );

      await expect(input.guestPrompt()).rejects.toBeUndefined();
    });
  });
});

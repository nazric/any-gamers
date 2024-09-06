import { add_numbers } from "../../components/calculator";

describe("Calculator Component", () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(add_numbers(1, 2)).toBe(3);
      });
});



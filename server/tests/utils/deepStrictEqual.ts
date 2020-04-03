import { assert } from "chai";

export const deepStrictEqual = (a: any, b: any): boolean => {
  assert.deepStrictEqual(a, b);
  return true;
}
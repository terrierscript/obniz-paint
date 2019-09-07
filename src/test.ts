import { bitToRaw, binToRawWasm } from "./obniz"

export const doTest = () => {
  const fixture = [Array(16).fill(1), Array(16).fill(0)]
  console.log(binToRawWasm(fixture))
}

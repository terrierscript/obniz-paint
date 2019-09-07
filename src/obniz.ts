// import Obniz from "obniz"
import module from "../obniz-raw/Cargo.toml"

const chunks = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]]
  }, [])
}
export const binToRawWasm = (bitmap) => {
  const r = module.main(bitmap)
  return r
}
const binToDec = (c) => {
  return c.reverse().reduce((acc, curr, i) => {
    return acc + curr * 2 ** i
  }, 0)
}
export const bitToRaw = (bitmap) => {
  const raw = bitmap
    .map((m, x) =>
      chunks(m, 8).map(
        (c) => binToDec(c)
        // parseInt(c.join(""), 2))
      )
    )
    .reduce((curr, c) => [...curr, ...c], [])
  return raw
}

// @ts-ignore
export const createObnizClient = () => {
  return new Obniz(process.env.OBNIZ_ID, {
    access_token: process.env.OBNIZ_ACCESS_TOKEN
  })
}

// export const syncObniz = (bitmap) => {
//   obniz.onconnect = async function() {
//     obniz.display.clear()
//     const raw = bitToRaw(bitmap)
//     console.log(raw)
//     obniz.display.raw(raw)
//   }
// }

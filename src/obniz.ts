import Obniz from "obniz"

const chunks = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]]
  }, [])
}

const bitToRaw = (bitmap) => {
  const raw = bitmap
    .map((m, x) => chunks(m, 8).map((c) => parseInt(c.join(""), 2)))
    .reduce((curr, c) => [...curr, ...c], [])
  return raw
}

const obniz = new Obniz(process.env.OBNIZ_ID, {
  access_token: process.env.OBNIZ_ACCESS_TOKEN
})

export const syncObniz = (bitmap) => {
  obniz.onconnect = async function() {
    obniz.display.clear()
    const raw = bitToRaw(bitmap)
    obniz.display.raw(raw)
  }
}
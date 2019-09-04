import { bitToRaw } from "./obniz"

self.onmessage = (e) => {
  const bin = bitToRaw(e.data)
  // const obnizClient = createObnizClient()
  // obnizClient.onconnect = function() {
  //   obnizClient.display.raw(bin)
  // }
  // // @ts-ignore
  self.postMessage(bin)
}

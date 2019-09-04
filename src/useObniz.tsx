import { useState, useEffect } from "react"
import { createObnizClient } from "./obniz"
export const useObniz = () => {
  const [_obniz, setObniz] = useState<null | any>(null)
  useEffect(() => {
    const obnizClient = createObnizClient()
    Promise.resolve().then(async () => {
      obnizClient.onconnect = await function() {
        setObniz(obnizClient)
      }
    })
  }, [])

  return _obniz
}

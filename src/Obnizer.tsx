import React, { useEffect, useState, useContext } from "react"
import { bitToRaw } from "./obniz"
import { useObniz } from "./useObniz"
import { DrwaMapContext } from "./index"
export const Obnizer = ({ children }) => {
  // return children
  const { mapRef } = useContext(DrwaMapContext)
  const [ready, setReady] = useState(false)
  const obniz = useObniz()
  useEffect(() => {
    if (obniz === null) {
      return
    }
    // @ts-ignore
    const loop = window.requestIdleCallback || window.requestAnimationFrame
    const frame = () =>
      loop(() => {
        obniz.display.raw(bitToRaw(mapRef.current))
        frame()
      })
    frame()
    setReady(true)
  }, [obniz])
  // if (!ready) {
  //   return <div>loading...</div>
  // }
  return children
}

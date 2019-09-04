import { useState, useCallback, useEffect, useRef } from "react"
import produce from "immer"
import { generateInitMap } from "./index"
import { bitToRaw } from "./obniz"
import { useObniz } from "./useObniz"
export const useDrawMap = () => {
  const map = useRef(generateInitMap(64, 128))
  const [ready, setReady] = useState(false)

  const toggle = useCallback((x, y, v = undefined) => {
    const bitmap = map.current
    // setMap((bitmap) => {
    if (bitmap[y] === undefined) {
      return bitmap
    }
    if (bitmap[y][x] === undefined) {
      return bitmap
    }
    produce(bitmap, async (draftMap) => {
      if (v === undefined) {
        const val = bitmap[y][x] === 1 ? 0 : 1
        draftMap[y][x] = val
      } else {
        draftMap[y][x] = v
      }
    }).then((next) => {
      map.current = next
    })
  }, [])
  const obniz = useObniz()

  useEffect(() => {
    if (obniz === null) {
      return
    }
    // @ts-ignore
    const loop = window.requestIdleCallback || window.requestAnimationFrame
    const frame = () =>
      loop(() => {
        if (map.current) {
          obniz.display.raw(bitToRaw(map.current))
        }
        frame()
      })
    frame()
    setReady(true)
  }, [obniz])

  return {
    // bin,
    ready,
    toggle
    // setReady
  }
}

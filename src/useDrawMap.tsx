import { useState, useCallback, useEffect, useRef } from "react"
import produce from "immer"
import { generateInitMap } from "./index"
import { bitToRaw } from "./obniz"
export const useDrawMap = () => {
  const map = useRef(generateInitMap(64, 128))
  // const [bitmap, setMap] = useState(null)

  const [bin, setBin] = useState(null)
  // console.log(bitmap.length)
  // console.log(bitmap[0].length)

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
      // console.log(next)
      // setMap(next)
    })

    // return next
    // })
  }, [])
  // useEffect(() => {
  //   const timer = () =>
  //     setTimeout(() => {
  //       if (map.current) {
  //         setBin(bitToRaw(map.current))
  //       }
  //       // setMap(map.current)
  //       timer()
  //     }, 1000)
  //   timer()
  // }, [])
  return {
    bin,
    // bitmap,
    toggle
  }
}

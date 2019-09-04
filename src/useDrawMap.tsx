import { useState, useCallback } from "react"
import produce from "immer"
import { generateInitMap } from "./index"
export const useDrawMap = () => {
  const [bitmap, setMap] = useState(generateInitMap(64, 128))
  // console.log(bitmap.length)
  // console.log(bitmap[0].length)
  const toggle = useCallback((x, y) => {
    setMap((bitmap) => {
      if (bitmap[y] === undefined) {
        return bitmap
      }
      if (bitmap[y][x] === undefined) {
        return bitmap
      }
      const next = produce(bitmap, (draftMap) => {
        const val = bitmap[y][x] === 1 ? 0 : 1
        draftMap[y][x] = val
      })

      return next
    })
  }, [])
  return {
    bitmap,
    toggle
  }
}

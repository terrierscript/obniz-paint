import { useState, useCallback, useEffect, useRef } from "react"
import produce from "immer"
import { generateInitMap } from "./index"
import { bitToRaw } from "./obniz"
import { useObniz } from "./useObniz"
export const useDrawMap = () => {
  const mapRef = useRef(generateInitMap(64, 128))

  const toggle = useCallback((x, y, v = undefined) => {
    const bitmap = mapRef.current
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
      mapRef.current = next
    })
  }, [])
  return {
    mapRef,
    toggle
  }
}

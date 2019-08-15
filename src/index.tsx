import React, { useState, useCallback, useEffect } from "react"
import { render } from "react-dom"
import produce from "immer"
import styled from "styled-components"
import { syncObniz, obniz, bitToRaw } from "./obniz"
const generateInitMap = (w, h) => {
  return Array(w)
    .fill(0)
    .map((_) => Array(h).fill(0))
}

const useDrawMap = () => {
  const [bitmap, setMap] = useState(generateInitMap(128, 64))
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

const Cell = styled.div<{ val: Number }>`
  width: 4px;
  height: 4px;
  background: ${({ val }) => (val === 1 ? "red" : "blue")};
`
const Item = ({ val, ...rest }) => {
  return <Cell val={val} {...rest} />
}
const ItemMemo = React.memo(Item)

const Base = styled.div`
  display: grid;
  grid-template-columns: repeat(128, 4px);
  /* grid-auto-columns: max-content;
  grid-auto-rows: max-content; */
  /* grid-gap: 0em; */
`
const Row = ({ y, xs, toggle }) => {
  return (
    <React.Fragment key={y}>
      {xs.map((v, x) => {
        return (
          <ItemMemo
            val={v}
            key={`${x}_${y}`}
            onMouseOver={() => {
              toggle(x, y)
            }}
          />
        )
      })}
    </React.Fragment>
  )
}

const RowMemo = React.memo(Row)

const Map = ({ bitmap, toggle }) => {
  return (
    <>
      {bitmap.map((xs, y) => {
        return (
          <React.Fragment key={y}>
            <RowMemo y={y} xs={xs} toggle={toggle} />
          </React.Fragment>
        )
      })}
    </>
  )
}
const MapMemo = React.memo(Map)
const App = () => {
  const { bitmap, toggle } = useDrawMap()
  useEffect(() => {
    const raw = bitToRaw(bitmap)
    obniz.display.raw(raw)

    syncObniz(bitmap)
  }, [bitmap])
  return (
    <div>
      <Base>
        <Map bitmap={bitmap} toggle={toggle} />
      </Base>
    </div>
  )
}

obniz.onconnect = async function() {
  render(<App />, document.querySelector("#container"))
}

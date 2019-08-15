import React, { useState } from "react"
import { render } from "react-dom"
import produce from "immer"
import styled from "styled-components"
const generateInitMap = (w, h) => {
  return Array(w)
    .fill(0)
    .map((row) => Array(h).fill(0))
}

const useDrawMap = () => {
  const [bitmap, setMap] = useState(generateInitMap(128, 64))
  const toggle = (x, y) => {
    if (bitmap[y] === undefined) {
      return
    }
    if (bitmap[y][x] === undefined) {
      return
    }
    const next = produce(bitmap, (draftMap) => {
      const val = bitmap[y][x] === 1 ? 0 : 1
      draftMap[y][x] = val
    })
    setMap(next)
  }
  return {
    bitmap,
    toggle
  }
}

const Item = ({ val, ...rest }) => {
  return <div {...rest}>{val === 1 ? "○" : "●"}</div>
}

const Base = styled.div`
  display: grid;
  grid-template-columns: repeat(128, 1fr);
  grid-auto-columns: max-content;
  grid-auto-rows: max-content;
  grid-gap: 0.2em;
`
const App = () => {
  const { bitmap, toggle } = useDrawMap()

  return (
    <div>
      <Base>
        {bitmap.map((xs, y) => {
          return (
            <React.Fragment key={y}>
              {xs.map((v, x) => {
                return (
                  <Item
                    val={v}
                    key={`${x}_${y}`}
                    onClick={() => {
                      toggle(x, y)
                    }}
                  />
                )
              })}
            </React.Fragment>
          )
        })}
      </Base>
    </div>
  )
}

render(<App />, document.querySelector("#container"))

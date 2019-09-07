import React, { useRef, useState, useContext } from "react"
import { render } from "react-dom"
import styled from "styled-components"
import { useMouse } from "react-use"
import { useDrawMap } from "./useDrawMap"
import { Obnizer } from "./Obnizer"
import { doTest } from "./test"

export const generateInitMap = (w, h) => {
  return Array(w)
    .fill(false)
    .map((_) => Array(h).fill(false))
}
export const generateInitMapUint = (w, h) => {
  return Array(w)
    .fill(false)
    .map((_) => new Uint8Array(h))
}

export const DrwaMapContext = React.createContext<any>({})

const SIZE = 8

const Item = styled.div<{ val: Number }>`
  width: ${SIZE}px;
  height: ${SIZE}px;
  background: ${({ val }) => (val === 1 ? "red" : "blue")};
`

const Base = styled.div`
  display: grid;
  grid-template-columns: repeat(128, ${SIZE}px);
`

const ItemWithState = ({ x, y, ...props }) => {
  const [v, setV] = useState(0)
  const { toggle } = useContext(DrwaMapContext)
  return (
    <Item
      {...props}
      val={v}
      onMouseOver={() => {
        const n = v ? 0 : 1
        setV(n)
        toggle(x, y, n)
      }}
    />
  )
}

const Row = ({ y, xs }) => {
  return (
    <React.Fragment key={y}>
      {xs.map((v, x) => {
        return (
          <ItemWithState name={`${x}_${y}`} key={`${x}_${y}`} x={x} y={y} />
        )
      })}
    </React.Fragment>
  )
}

// const RowMemo = Row
const RowMemo = React.memo(Row)

const Map = ({ bitmap }) => {
  return (
    <>
      {bitmap.map((xs, y) => {
        return (
          <React.Fragment key={y}>
            <RowMemo y={y} xs={xs} />
          </React.Fragment>
        )
      })}
    </>
  )
}

const App = () => {
  const drwaMap = useDrawMap()
  const initMap = generateInitMap(64, 128)
  return (
    <DrwaMapContext.Provider value={drwaMap}>
      <Obnizer>
        <div>
          <Base>
            <Map bitmap={initMap} />
          </Base>
        </div>
      </Obnizer>
    </DrwaMapContext.Provider>
  )
}

render(<App />, document.querySelector("#container"))

doTest()

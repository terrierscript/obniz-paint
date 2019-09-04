import React, { useEffect, useRef, useState, useContext } from "react"
import { render } from "react-dom"
import styled from "styled-components"
import { bitToRaw } from "./obniz"
import { useMouse } from "react-use"
import { useDrawMap } from "./useDrawMap"
import { useObniz } from "./useObniz"

export const generateInitMap = (w, h) => {
  return Array(w)
    .fill(0)
    .map((_) => Array(h).fill(0))
}

const DrwaMapContext = React.createContext<any>({})

const SIZE = 4

const Item = styled.div<{ val: Number }>`
  width: ${SIZE}px;
  height: ${SIZE}px;
  background: ${({ val }) => (val === 1 ? "red" : "blue")};
`

// const ItemMemo = React.memo(Item)

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
// const MapMemo = React.memo(Map)
const MapMemo = Map

const Obnizer = ({}) => {
  // const { bin } = useContext(DrwaMapContext)
  // const obniz = useObniz()
  // useEffect(() => {
  //   console.log(obniz, bin)
  //   if (obniz === null || bin === null) {
  //     return
  //   }
  //   obniz.display.raw(bin)
  // }, [bin, obniz])
  return null
}
const App = () => {
  const drwaMap = useDrawMap()
  const initMap = generateInitMap(64, 128)
  if (!drwaMap.ready) {
    return <div>loading...</div>
  }
  return (
    <DrwaMapContext.Provider value={drwaMap}>
      <Obnizer />
      <div>
        <Base>
          <MapMemo bitmap={initMap} />
        </Base>
      </div>
    </DrwaMapContext.Provider>
  )
}

render(<App />, document.querySelector("#container"))

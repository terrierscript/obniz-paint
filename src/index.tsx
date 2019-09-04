import React, { useEffect, useRef } from "react"
import { render } from "react-dom"
import styled from "styled-components"
import { bitToRaw } from "./obniz"
import { useMouse } from "react-use"
import { useDrawMap } from "./useDrawMap";
import { useObniz } from "./useObniz";

export const generateInitMap = (w, h) => {
  return Array(w)
    .fill(0)
    .map((_) => Array(h).fill(0))
}

const SIZE=4;

const Item = styled.div<{ val: Number , size: Number}>`
  width: ${SIZE}px;
  height: ${SIZE}px;
  background: ${({ val }) => (val === 1 ? "red" : "blue")};
`

const ItemMemo = React.memo(Item)

const Base = styled.div`
  display: grid;
  grid-template-columns: repeat(128, 4px);
`
const Row = ({ y, xs, toggle }) => {
  return (
    <React.Fragment key={y}>
      {xs.map((v, x) => {
        return (
          <ItemMemo
            val={v}
            key={`${x}_${y}`}
            // onMouseOver={() => {
            //   toggle(x, y)
            // }}
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

const BaseContainer = ({ children, toggle }) => {
  const ref = useRef(null)
  const {elX, elY} = useMouse(ref)
  console.log(elX)
  useEffect( () => {
    const pt = [
      Math.floor(elX/2), 
      Math.floor(elY/2),
    ]
    // console.log(pt)
    toggle(...pt)
  }, [elX, elY])
  return <Base ref={ref}>{children}</Base>
}

const App = () => {
  const { bitmap, toggle } = useDrawMap()
  const obniz = useObniz()
  useEffect(() => {
    if (obniz === null) {
      return
    }
    const raw = bitToRaw(bitmap)
    obniz.display.raw(raw)
  }, [bitmap, obniz])
  return (
    <div>
      <BaseContainer toggle={toggle}>
        <MapMemo bitmap={bitmap} toggle={toggle} />
      </BaseContainer>
    </div>
  )
}

render(<App />, document.querySelector("#container"))

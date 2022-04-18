import React, { useState, useReducer, useEffect } from 'react';
import Cell from './Cell';

const CASES = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

const cell_size = 80;
const grid_size = 3;

// 0, 2, 2,
// 0, 0, 0,
// 0, 0, 0

// const initialReducerState = [2, 2, 2, 0, 0, 2, 0, 0, 2];
const initialReducerState = [0, 0, 2, 2, 0, 2, 0, 2, 2];

const logicReducer = (state, action) => {
  let updatedState = [...state];
  const cellsCount = updatedState.length;

  switch (action.type) {
    case CASES.UP:
      console.log('swiped up');
      for (let index = 0; index < cellsCount; index++) {
        const currIndex = Math.abs(0 - index);
        const cell = updatedState[currIndex];
        const normalizedIndex = currIndex + 1;
        const neighgourIndex = currIndex - grid_size;
        const atEdge = grid_size >= normalizedIndex;

        if (!atEdge) {
          const currVal = cell;
          const neighBourVal = updatedState[neighgourIndex];
          if (currVal === neighBourVal) {
            updatedState[neighgourIndex] = currVal + neighBourVal;
            updatedState[currIndex] = 0;
          } else if (neighBourVal === 0) {
            updatedState[neighgourIndex] = currVal;
            updatedState[currIndex] = 0;
          }
        }
      }
      return [...updatedState];
    case CASES.DOWN:
      console.log('swiped DOWN');
      for (let index = 0; index < cellsCount; index++) {
        const currIndex = Math.abs(cellsCount - index);
        const cell = updatedState[currIndex];
        const normalizedIndex = currIndex + 1;
        const neighgourIndex = currIndex + grid_size;
        const atEdge = grid_size > cellsCount - normalizedIndex;

        if (!atEdge) {
          const currVal = cell;
          const neighBourVal = updatedState[neighgourIndex];
          if (currVal === neighBourVal) {
            updatedState[neighgourIndex] = currVal + neighBourVal;

            updatedState[currIndex] = 0;
          } else if (neighBourVal === 0) {
            updatedState[neighgourIndex] = currVal;

            updatedState[currIndex] = 0;
          }
        }
      }
      return [...updatedState];
    case CASES.LEFT:
      console.log('swiped LEFT');
      for (let index = 0; index < cellsCount; index++) {
        const currIndex = Math.abs(0 - index);
        const cell = updatedState[currIndex];
        const normalizedIndex = currIndex + 1;
        const neighgourIndex = currIndex - 1;
        const atEdge = normalizedIndex % grid_size === 1;

        if (!atEdge) {
          const currVal = cell;
          const neighBourVal = updatedState[neighgourIndex];
          if (currVal === neighBourVal) {
            updatedState[neighgourIndex] = currVal + neighBourVal;
            updatedState[currIndex] = 0;
          } else if (neighBourVal === 0) {
            updatedState[neighgourIndex] = currVal;
            updatedState[currIndex] = 0;
          }
        }
      }

      return [...updatedState];
    case CASES.RIGHT:
      console.log('swiped RIGHT');
      for (let index = 0; index < cellsCount; index++) {
        const currIndex = Math.abs(0 - index);
        const cell = updatedState[currIndex];
        const normalizedIndex = currIndex + 1;
        const neighgourIndex = currIndex + 1;
        const atEdge = normalizedIndex % grid_size === 0;

        if (!atEdge) {
          const currVal = cell;
          const neighBourVal = updatedState[neighgourIndex];
          if (currVal === neighBourVal) {
            updatedState[neighgourIndex] = currVal + neighBourVal;
            updatedState[currIndex] = 0;
          } else if (neighBourVal === 0) {
            updatedState[neighgourIndex] = currVal;
            updatedState[currIndex] = 0;
          }
        }
      }
      return [...updatedState];
    default:
      return updatedState;
  }
};

const Grid = () => {
  const [clicked, setClicked] = useState(false);
  const [state, dispatch] = useReducer(logicReducer, initialReducerState);

  // const [offsetCounter, setOffsetCounter] = useState(0);
  const [initialXY, setInitialXY] = useState([null, null]);
  const [lastXY, setLastXY] = useState([null, null]);

  const handleMouseMove = (e) => {
    if (!clicked) return;
    if (lastXY[0] !== null) return;

    const { clientX, clientY } = e;

    setLastXY([clientX, clientY]);

    // console.log(clientX, clientY);
    return;
  };

  useEffect(() => {
    if (lastXY[0] !== null) {
      const calculatedX = initialXY[0] - lastXY[0];
      const calculatedY = initialXY[1] - lastXY[1];

      let direction = null;
      if (calculatedX === 0) {
        // UP or DOWN
        direction = calculatedY < 0 ? CASES.DOWN : CASES.UP;
      } else if (calculatedY === 0) {
        // LEFT or RIGHT
        direction = calculatedX < 0 ? CASES.RIGHT : CASES.LEFT;
      } else {
        // Calculate the difference, if both x and y differ
        const larger =
          Math.abs(calculatedX) > Math.abs(calculatedY)
            ? ['x', calculatedX]
            : ['y', calculatedY];
        if (larger[0] === 'x') {
          direction = larger[1] < 0 ? CASES.RIGHT : CASES.LEFT;
        } else if (larger[0] === 'y') {
          direction = larger[1] < 0 ? CASES.DOWN : CASES.UP;
        }
        console.log('larger: ', larger);
      }

      dispatch({ type: direction });

      console.log(`calcX: ${calculatedX}, calcY: ${calculatedY}`);
    }
  }, [lastXY[0]]);

  return (
    <div>
      <h2> {clicked ? 'CLICKED' : 'NOT CLICKED'}</h2>
      <h3>InitialXY: {JSON.stringify(initialXY)}</h3>
      <h3>LastXY: {JSON.stringify(lastXY)}</h3>

      <div
        className="grid"
        style={{ '--grid-size': grid_size, '--cell-size': cell_size }}
        onMouseDown={(e) => {
          setClicked(true);
          setInitialXY([e.clientX, e.clientY]);
        }}
        onMouseUp={(e) => {
          setClicked(false);
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setClicked(false)}
      >
        {state.map((arrNumber, index) => {
          return <Cell key={index} number={arrNumber} />;
        })}
      </div>
    </div>
  );
};

export default Grid;

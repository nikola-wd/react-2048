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

const getRows = (arr, size) => {
  const rows = [];
  for (let i = 0; i < arr.length; i++) {
    if (i % size === 0) {
      const row = [];
      for (let j = 0; j < size; j++) {
        const originalPos = i + j;
        row.push(arr[originalPos]);
      }
      rows.push(row);
    }
  }
  return rows;
};

const getCols = (arr, size) => {
  const cols = [];

  const steps = [];
  for (let i = 0; i < size; i++) {
    steps.push(i * size);
  }
  for (let i = 0; i < size; i++) {
    let col = [];
    for (let j = 0; j < size; j++) {
      const originalPos = i + steps[j];
      col.push(arr[originalPos]);
    }
    cols.push(col);
    col = [];
  }

  return cols;
};

const removeZeros = (arr) => {
  let strippedZeros = [...arr];

  strippedZeros = strippedZeros.filter((n) => n !== 0);

  return strippedZeros;
};

const doTheLogic = (arr) => {
  const originalSize = arr.length;

  // remove zeros
  let noZerosArr = removeZeros(arr);

  // combine numbers
  for (let index = noZerosArr.length - 1; index >= 0; index--) {
    const prevIndex = index - 1;

    if (prevIndex >= 0 && noZerosArr[index] === noZerosArr[prevIndex]) {
      noZerosArr[index] = noZerosArr[index] * 2;
      noZerosArr[prevIndex] = 0;
    }
  }
  noZerosArr = removeZeros(noZerosArr);

  // prepend zeros
  const noZerosArrSize = noZerosArr.length;
  const finalArr = [...Array(originalSize - noZerosArrSize).fill(0)].concat(
    noZerosArr
  );

  return finalArr;
};

// const initialReducerState = [2, 2, 2, 0, 0, 2, 0, 0, 2];
const initialReducerState = [0, 0, 2, 2, 0, 2, 0, 2, 2];

const spawnNumberAndGetFinalArr = (arr) => {
  let newArr = [...arr];
  const genRandomIndex = (arr) => Math.floor(Math.random() * newArr.length);
  let randomIndex = genRandomIndex(arr);
  while (newArr[randomIndex] !== 0) {
    randomIndex = genRandomIndex(arr);
  }

  newArr[randomIndex] = 2;

  return newArr;
};

const logicReducer = (state, action) => {
  let updatedState = [...state];

  switch (action.type) {
    case CASES.UP:
      console.log('swiped UP');

      let cols_u = getCols(updatedState, grid_size);
      cols_u = cols_u.map((col) => doTheLogic(col));
      cols_u = cols_u.map((col) => {
        const reversedCol = [...col].reverse();
        return [...doTheLogic(reversedCol)].reverse();
      });

      let finishedArrUp = [];
      for (let i = 0; i < grid_size; i++) {
        const col = [];
        for (let j = 0; j < grid_size; j++) {
          col.push(cols_u[j][i]);
        }
        finishedArrUp.push(col);
      }
      updatedState = finishedArrUp.flat();
      updatedState = spawnNumberAndGetFinalArr(updatedState);
      return [...updatedState];
    case CASES.DOWN:
      console.log('swiped DOWN');
      let cols_d = getCols(updatedState, grid_size);
      cols_d = cols_d.map((col) => doTheLogic(col));

      let finishedArrDown = [];
      for (let i = 0; i < grid_size; i++) {
        const col = [];
        for (let j = 0; j < grid_size; j++) {
          col.push(cols_d[j][i]);
        }
        finishedArrDown.push(col);
      }
      updatedState = finishedArrDown.flat();
      updatedState = spawnNumberAndGetFinalArr(updatedState);

      return [...updatedState];
    case CASES.LEFT:
      console.log('swiped LEFT');
      let rows_l = getRows(updatedState, grid_size);
      rows_l = rows_l.map((row) => {
        const reversedRow = [...row].reverse();
        return [...doTheLogic(reversedRow)].reverse();
      });

      updatedState = [...rows_l.flat()];
      updatedState = spawnNumberAndGetFinalArr(updatedState);
      return [...updatedState];
    case CASES.RIGHT:
      console.log('swiped RIGHT');
      let rows_r = getRows(updatedState, grid_size);
      rows_r = rows_r.map((row) => {
        return doTheLogic(row);
      });
      updatedState = [...rows_r.flat()];
      updatedState = spawnNumberAndGetFinalArr(updatedState);
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
      }

      dispatch({ type: direction });
    }
  }, [lastXY[0]]);

  useEffect(() => {
    let timeoutID = null;

    if (timeoutID === null) {
      timeoutID = setTimeout(() => {
        setLastXY([null, null]);
      }, 500);
    }

    return () => {
      clearTimeout(timeoutID);
      timeoutID = null;
    };
  }, [state]);

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

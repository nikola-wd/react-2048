import React, { Fragment } from 'react';
import Cell from './Cell';

const cell_size = 80;
const grid_size = 3;

const Grid = () => {
  return (
    <div
      className="grid"
      style={{ '--grid-size': grid_size, '--cell-size': cell_size }}
    >
      {[...Array(grid_size * grid_size).keys()].map((_, index) => {
        const number = Math.random() <= 0.5 ? 0 : Math.random() <= 0.5 ? 2 : 4;

        return <Cell key={index} number={number} />;
      })}
    </div>
  );
};

export default Grid;

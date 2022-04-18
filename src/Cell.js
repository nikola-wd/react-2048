import React from 'react';

const Cell = ({ number }) => {
  return (
    <div className="cell">
      {/* {number !== 0 ? number : null} */}
      {number}
    </div>
  );
};

export default Cell;

import React, { useState } from "react";


import {
  styled
} from '@mui/material';

const CardWrapper = styled('div')(
  ({ theme }) => `
      margin-right: 30px;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      border-radius: 30px;
      backdrop-filter: blur(50px);
      background: rgb(2, 0, 36);
      padding: 10px;
      text-align: center;
      object-fit: cover;
      cursor: pointer;
      transition: width 1s ease-in-out, height .5s ease-in-out !important;
      -webkit-tap-highlight-color: transparent;
`
);

// .card {
    
//   margin-left:15px;
//   margin-right: 15px;
//   /* margin-bottom: 10px; */
//   /* box-shadow: 0 15px 25px rgba(129, 124, 124, 0.2); */
//   box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
//   border-radius: 30px;
//   backdrop-filter: blur(50px);
//   /* filter:blur(4px); */
//   background: rgb(2, 0, 36);
//   /* background: radial-gradient(
//     circle,
//     rgba(255, 255, 255, 0.05) 0%,
//     #00f5c966 0%,
//     rgba(255, 255, 255, 0.05) 70%
//   ); */
//   padding: 10px;
//   text-align: center;
//   object-fit: cover;
//   cursor: pointer;
//   transition: width 1s ease-in-out, height .5s ease-in-out !important;
//   -webkit-tap-highlight-color: transparent;
// }


const Card = React.forwardRef(
  (
    {
      width = "280px",
      height = "380px",
      child,
      blurColor = "rgba(48,118,234,0.2)",
      onClick,
    },
    ref
  ) => (
    <CardWrapper
      style={{
        width: `${width}`,
        height: `${height}`,
        marginBottom: '70px',
        background: `radial-gradient(
                circle,
                rgba(255, 255, 255, 0.05) 0%,
                ${blurColor} 0%,
                rgba(255, 255, 255, 0.05) 70%
              )`,
      }}
      onClick={onClick}
      ref={ref}
    >
        {child}
    </CardWrapper>
  )
);
export default Card;

import { Button } from '@mui/material'
import React from 'react'
import { NavLink } from 'react-router-dom';

const ButtonComponent = ({ onClick ,text,icon}) => {
  return (
   <Button variant="contained" bgcolor="#1273BA" type='submit' onClick={onClick} startIcon={icon} sx={{
    borderRadius: 2,
    textTransform: 'none',
    px: 3,      }}>
    {text}
   </Button>
  )
}



const Buttons = ({ to, children ,isWhite, bgColor }) => {
  return (
      <Button
          color="inherit"
          component={NavLink}
          to={to}
         
          sx={{
          backgroundColor: bgColor || '#57ADDE',
          color: isWhite ? '#338CC7' : '#fff',
          border: '1px solid #fff',
          borderRadius: '20px',
          marginRight: '8px',
          fontSize: '0.8rem',
          textTransform:"none",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width:"100px",
          height:"40px",
          '&:hover': {
          color: isWhite ? '#338CC7' : '#fff',
          backgroundColor: bgColor || '#57ADDE',
        },
        '&.active': {
          color: isWhite ? '#338CC7' : '#fff',
          backgroundColor: bgColor || '#57ADDE',
        },
          }}
      >
          {children}
      </Button>
  );
};

export {ButtonComponent,Buttons} 

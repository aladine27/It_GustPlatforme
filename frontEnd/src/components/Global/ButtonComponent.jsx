import { Button } from '@mui/material'
import React from 'react'

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

export default ButtonComponent

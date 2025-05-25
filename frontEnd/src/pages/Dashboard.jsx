import React from 'react'

import Navbar from '../components/Navbar'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import SideBar from '../components/SideBar'

function Dashboard() {
  return (
    <>
    <Navbar/>
    <Box style={{display:'flex', justifyContent:'space-between', width:'100%' ,backgroundColor:'red'}}>
    <SideBar />
    <Outlet/>
    </Box>
    </>
 
  )
}

export default Dashboard

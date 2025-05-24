import React from 'react'
import SideBar from '../components/sideBar'
import Navbar from '../components/Navbar'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <>
    <Navbar/>
    <Box style={{display:'flex',border:'1px solid black', justifyContent:'space-between', marginTop:'70px', flexDirection:'row', width:'100%'}}>
    <SideBar />
    <Outlet/>

    </Box>
    </>
 
  )
}

export default Dashboard

import { createTheme } from '@mui/material'
import React from 'react'


export const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f5f5f5',
        },

    },    
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        h3: {
            fontFamily:"inter",
            fontSize: '500',
            fontWeight: "bold",
            marginBottom:"10px",
            color:"#080D50"
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
        },
    },      

})



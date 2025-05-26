import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Card, Typography } from '@mui/material';

const Employe = () => {
 
  
  const rows = [
   {name:'Ahmed',email:'ahmed@gmail.com',phone:'22222222',domain:'Developpement web'},
   {name:'Ahmed',email:'ahmed@gmail.com',phone:'22222222',domain:'Developpement web'},
   {name:'Ahmed',email:'ahmed@gmail.com',phone:'22222222',domain:'Developpement web'}
  ];
  return (
   <>
   <Card sx={{ padding: 2, margin: 2 ,padding:8}}>
   <Typography>Liste des employés</Typography>
     <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Téléphone</TableCell>
            <TableCell align="right">Domaine</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row,index) => (
            <TableRow
              key={index}
            
            >
              <TableCell>
                {row.name}
              </TableCell>
              
              <TableCell >{row.email}</TableCell>
              <TableCell >{row.phone}</TableCell>
              <TableCell >{row.domain}</TableCell>
              <TableCell >
                <Button variant='outlined'>
Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Card>

   </>
  )
}

export default Employe

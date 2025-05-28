import { Box, Button, FormControl, Grid, TextField } from '@mui/material'
import React, { use, useState } from 'react'

const AddEmploye = () => {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [adresse, setAdresse] = useState('');
    const [telephone, setTelephone] = useState('');
    const [domaine, setDomaine] = useState('');
    const [role, setRole] = useState('');
  return (
    <>
    <Grid style={{width:'500px',height:'500px'}}>
    <form>
    
        <Grid container spacing={2}/>
        
            <Grid item xs={6}>
                
                <FormControl>  <TextField fullWidth label="nom" variant="outlined">nom</TextField> </FormControl> </Grid>
                <Grid item xs={6}>
                <FormControl>  <TextField fullWidth label="Email" variant="outlined">Email</TextField> </FormControl>
                </Grid>
                <Grid item xs={6}>
                <FormControl>  <TextField fullWidth label="Adresse" variant="outlined">Adresse</TextField></FormControl>
                </Grid>
                <Grid item xs={6}>
                <FormControl>  <TextField fullWidth label="telephone" variant="outlined">numero telephone</TextField></FormControl>
                </Grid>
                <Grid item xs={6}>
                <FormControl>  <TextField fullWidth label="Domaine" variant="outlined">Domaine</TextField></FormControl>
                </Grid>
                <Grid item xs={6}>
                <FormControl>  <TextField fullWidth label="Role" variant="outlined">Role</TextField></FormControl>
                </Grid>
              
            
      <Box marginTop="40px">
    <Button>valider</Button>
    </Box> 
    </form>
    </Grid>
      
    </>
  )
}

export default AddEmploye

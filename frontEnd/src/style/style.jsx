// style.jsx
import { Card, Paper, Button, Typography, TextField } from "@mui/material";
import styled from "@emotion/styled";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: 18,
  borderRadius: 15,
  backgroundColor: theme.palette.background.paper,
  border: `1.5px solid #b3d6fc`,
  boxShadow: '0 6px 30px 0 rgba(25,118,210,0.10)',
  transition: 'box-shadow 0.22s, border-color 0.18s',
  '&:hover, &:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: '0 10px 38px 0 rgba(25,118,210,0.16)',
  },
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  padding: 16,
  borderRadius: 18,
  backgroundColor: theme.palette.background.paper,
  border: `1.5px solid ${theme.palette.primary.light}`,
  boxShadow: '0 4px 24px rgba(25,118,210,0.07)'
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: theme.palette.primary.main,
  fontSize: '2rem',
  marginBottom: theme.spacing(2),
  letterSpacing: 0.4
}));

export const Section = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 14,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  border: `1.5px solid ${theme.palette.primary.light}`
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 24,
  fontWeight: 700,
  textTransform: "none",
  background: theme.palette.primary.main,
  color: "#fff",
  padding: "10px 22px",
  boxShadow: 'none',
  '&:hover': {
    background: theme.palette.primary.dark
  }
}));

export const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 24,
    background: '#fff'
  },
  '& .MuiInputBase-input': {
    fontSize: '1rem',
    padding: '10.5px 14px'
  }
}));

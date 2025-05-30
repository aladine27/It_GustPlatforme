import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Box, Avatar, Typography, IconButton, Tooltip
} from '@mui/material';

const TableComponent = ({ rows, columns, actions }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
    {/* Début de la table */}
      <Table aria-label="employee table">
      {/* Début de la table */}
        <TableHead>
          <TableRow sx={{ bgcolor: '#f8f9fa' }}>
            {/* Début de la table */}
            {columns.map((column) => (
              <TableCell key={column.id} align={column.align || "center"} style={{ color: "#080D50", fontWeight: "bold" }}>
                {column.label}
              </TableCell>
            ))}
            {/* Si la table a des actions, ajouter une colonne "Actions" dans l'en-tête */}
            {actions && (
              <TableCell align="center" style={{ color: "#080D50", fontWeight: "bold" }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        {/* Corps de la table avec les données */}
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
          {/* Affichage des cellules selon les colonnes définies */}
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || "center"}>
                 {/* Si c'est la colonne 'name', on affiche un avatar + le texte */}
                  {column.id === 'name' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40, fontSize: '0.9rem' }}>
                        {row.avatar}
                      </Avatar>
                      <Typography>{row[column.id]}</Typography>
                    </Box>
                  ) : column.render ? (
                    // Si une fonction `render` est fournie, on l'utilise pour afficher la cellule
                    column.render(row)
                  ) : (
                    // Sinon on affiche simplement la valeur correspondante
                    row[column.id]
                  )}
                </TableCell>
              ))}
               {/* Si des actions sont définies, on ajoute les boutons d'action ici */}
              {actions && (
                <TableCell align="center">
                  {actions.map((action, index) => (
                    <Tooltip title={action.tooltip || ""} key={index}>
                      <IconButton onClick={() => action.onClick(row)}>
                        {action.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;

import { useState } from "react";
import { Box, Typography, Stack, TextField } from "@mui/material";
import ModelComponent from "./Global/ModelComponent";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ButtonComponent } from "./Global/ButtonComponent";

const labels = {
  employes: { 
    title: "Export des employés", 
    subtitle: "Choisissez la période" 
  },
  taches: { 
    title: "Export des tâches", 
    subtitle: "Sélectionnez les dates" 
  },
  evenements: { 
    title: "Export des événements", 
    subtitle: "Choisissez l'intervalle" 
  },
};

export default function ExportModal({ open, onClose, entity }) {
  const { title, subtitle } = labels[entity] || {};
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleExport = (format) => {
    console.log(`Export ${entity} en ${format} (${startDate} → ${endDate})`);
    // Appel API...
    onClose();
  };

  return (
    <ModelComponent
      open={open}
      handleClose={onClose}
      title={title}
      icon={null}
    >
      <Box sx={{ width: 400, p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center" mb={2}>
          {subtitle}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={2}>
            <DatePicker
              label="Date de début"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="Date de fin"
              value={endDate}
              onChange={setEndDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              <ButtonComponent text="Export PDF" onClick={() => handleExport('PDF')} />
              <ButtonComponent text="Export Excel" onClick={() => handleExport('Excel')} />
            </Stack>
          </Stack>
        </LocalizationProvider>
      </Box>
    </ModelComponent>
  );
}
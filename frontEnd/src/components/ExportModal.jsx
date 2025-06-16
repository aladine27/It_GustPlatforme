import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Stack, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ButtonComponent } from "./Global/ButtonComponent";
import ModelComponent from "./Global/ModelComponent";
import { ExportEmployesExcel, ExportEmployesPdf } from "../redux/actions/employeAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const labels = {
  employes: {
    title: "Export des employés",
    subtitle: "Choisissez la période"
  },
  // autres entités...
};

export default function ExportModal({ open, onClose, entity }) {
  const { title, subtitle } = labels[entity] || {};
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const dispatch = useDispatch();
  const { exportLoading } = useSelector(state => state.employe);

  // Format YYYY-MM-DD
  const toDateInputValue = date =>
    date
      ? date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
      : "";
      
  const handleExport = async (format) => {
    if (!startDate || !endDate) {
      toast.error("Veuillez choisir la date de début et de fin.");
      return;
    }
  
    const payload = {
      start: toDateInputValue(startDate),
      end: toDateInputValue(endDate),
    };
  
    let action, filename;
    if (format === "PDF") {
      action = ExportEmployesPdf;
      filename = `employes_${payload.start}_${payload.end}.pdf`;
    } else {
      action = ExportEmployesExcel;
      filename = `employes_${payload.start}_${payload.end}.xlsx`;
    }
  
    try {
      const resultAction = await dispatch(action(payload)).unwrap();
  
      // Check debug:  
      console.log(resultAction, typeof resultAction, resultAction.size);
  
      // Téléchargement du blob
      const url = window.URL.createObjectURL(new Blob([resultAction]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
  
      toast.success(`Export ${format} réussi !`);
      onClose();
    } catch (err) {
      toast.error("Erreur lors de l'export : " + err);
      onClose();
    }
  };
  

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={4000} />
      <ModelComponent open={open} handleClose={onClose} title={title} icon={null}>
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
                <ButtonComponent
                  text="Export PDF"
                  onClick={() => handleExport("PDF")}
                  disabled={exportLoading}
                />
                <ButtonComponent
                  text="Export Excel"
                  onClick={() => handleExport("Excel")}
                  disabled={exportLoading}
                />
              </Stack>
            </Stack>
          </LocalizationProvider>
        </Box>
      </ModelComponent>
    </>
  );
}

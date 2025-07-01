// components/DocumentCustomModal.js
import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Stack, Divider, CircularProgress } from "@mui/material";

//import ReactQuill from "react-quill";
//import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocumentTemplate, generatePdfFromHtml, fetchAllDocuments } from "../../redux/actions/documentAction";
import { toast } from "react-toastify";

const DocumentCustomModal = ({
  open,
  handleClose,
  docId,   // id du document à personnaliser
  userFullName,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.document);

  // État local
  const [editedHtml, setEditedHtml] = useState("");
  const [fetching, setFetching] = useState(false);

  // Charger la template depuis le backend
  useEffect(() => {
    if (open && docId) {
      setFetching(true);
      dispatch(fetchDocumentTemplate(docId))
        .unwrap()
        .then((data) => setEditedHtml(data.html))
        .catch((e) => toast.error(e || "Erreur de chargement template"))
        .finally(() => setFetching(false));
    }
  }, [open, docId, dispatch]);

  // Générer le PDF à partir du HTML édité
  const handleGeneratePdf = async () => {
    try {
      await dispatch(generatePdfFromHtml({ id: docId, html: editedHtml })).unwrap();
      toast.success("Document PDF généré et stocké !");
      dispatch(fetchAllDocuments()); // refresh
      handleClose();
    } catch (err) {
      toast.error(err || "Erreur lors de la génération du PDF");
    }
  };

  return (
    <ModelComponent open={open} handleClose={handleClose} maxWidth="md" title={`Personnaliser le document pour ${userFullName || ""}`}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minHeight: 550 }}>
        <Typography fontWeight={600}>Contenu à personnaliser</Typography>
        {fetching ? (
          <Box textAlign="center" py={3}><CircularProgress /></Box>
        ) : (
          <>
            <ReactQuill
              value={editedHtml}
              onChange={setEditedHtml}
              style={{ height: 200, marginBottom: 15 }}
              theme="snow"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link', 'image'],
                  [{ 'color': [] }, { 'background': [] }],
                  ['clean']
                ],
              }}
            />
            <Divider />
            <Typography fontSize={15} fontWeight={600}>Aperçu Live (HTML)</Typography>
            <Box sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              background: "#fafbfc",
              p: 2,
              minHeight: 180,
              overflow: "auto"
            }}>
              {/* Affiche le HTML live comme le verra le PDF */}
              <div dangerouslySetInnerHTML={{ __html: editedHtml }} />
            </Box>
            <Stack direction="row" justifyContent="flex-end" gap={2} mt={2}>
              <Button variant="contained" color="primary" onClick={handleGeneratePdf} disabled={loading}>
                {loading ? <CircularProgress size={20} /> : "Générer le PDF & Valider"}
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </ModelComponent>
  );
};

export default DocumentCustomModal;

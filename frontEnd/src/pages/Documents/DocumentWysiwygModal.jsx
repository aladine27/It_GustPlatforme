import React, { useEffect, useState, useRef } from "react";
import { Box, Button, Typography, Stack, CircularProgress } from "@mui/material";
import Modal from "../Global/ModelComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocumentTemplate } from "../../redux/actions/documentAction";

export default function DocumentWysiwygModal({
  open,
  handleClose,
  documentId,
  onGenerate,
}) {
  const dispatch = useDispatch();
  const { documentTemplate, loading } = useSelector((state) => state.document);
  const [editorContent, setEditorContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Récupérer le template HTML à l'ouverture
  useEffect(() => {
    if (open && documentId) {
      dispatch(fetchDocumentTemplate(documentId));
    }
  }, [open, documentId, dispatch]);

  // Injecter le contenu dans l'éditeur au chargement
  useEffect(() => {
    if (documentTemplate) setEditorContent(documentTemplate.html || "");
  }, [documentTemplate]);

  // Preview PDF (optionnel : ici simple preview HTML)
  const previewRef = useRef(null);

  return (
    <Modal open={open} handleClose={handleClose} maxWidth="md" title="Personnalisation du document">
      {loading && (
        <Box display="flex" alignItems="center" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      )}
      {!loading && (
        <>
          <Typography fontWeight={600} mb={2}>
            Modifiez le contenu ci-dessous avant de générer le document PDF officiel.
          </Typography>
          <ReactQuill
            value={editorContent}
            onChange={setEditorContent}
            theme="snow"
            style={{ minHeight: 220, background: "#fff", marginBottom: 15 }}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ color: [] }, { background: [] }],
                ["link", "image"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["clean"],
              ],
            }}
          />

          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Button
              variant={showPreview ? "outlined" : "contained"}
              onClick={() => setShowPreview((v) => !v)}
            >
              {showPreview ? "Masquer l'aperçu" : "Voir l'aperçu PDF"}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onGenerate(editorContent)}
            >
              Valider et générer le PDF
            </Button>
          </Stack>
          {showPreview && (
            <Box
              ref={previewRef}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                mt: 1,
                background: "#fff",
                minHeight: 300,
                maxHeight: 400,
                overflow: "auto",
                p: 2,
              }}
              dangerouslySetInnerHTML={{ __html: editorContent }}
            />
          )}
        </>
      )}
    </Modal>
  );
}

import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Stack, CircularProgress } from "@mui/material";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useDispatch, useSelector } from "react-redux";
import { fetchDocumentTemplate, generatePdfFromHtml, fetchAllDocuments } from "../../redux/actions/documentAction";
import { toast } from "react-toastify";
import ModelComponent from "../Global/ModelComponent";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

const DocumentCustomModal = ({
  open,
  handleClose,
  docId,
  userFullName,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.document);

  const [editedHtml, setEditedHtml] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && docId) {
      setFetching(true);
      setError(null);
      dispatch(fetchDocumentTemplate(docId))
        .unwrap()
        .then((html) => {
          if (typeof html === "string") setEditedHtml(html);
          else setEditedHtml(html?.data ?? "");
        })
        .catch((e) => {
          setError(e || "Erreur de chargement du template");
          toast.error(e || "Erreur de chargement du template");
          setEditedHtml("");
        })
        .finally(() => setFetching(false));
    }
    if (!open) {
      setEditedHtml("");
      setError(null);
    }
    if (!open && fullScreen) setFullScreen(false);
  }, [open, docId, dispatch]);

  const handleGeneratePdf = async () => {
    try {
      await dispatch(generatePdfFromHtml({ id: docId, html: editedHtml })).unwrap();
      toast.success("Document PDF généré et stocké !");
      dispatch(fetchAllDocuments());
      handleClose();
    } catch (err) {
      toast.error(err || "Erreur lors de la génération du PDF");
    }
  };

  return (
    <>
      {/* MODAL PRINCIPAL */}
      <ModelComponent
        open={open}
        handleClose={handleClose}
        fullScreen={fullScreen}
        maxWidth={fullScreen ? false : "md"}
        title={`Personnaliser le document pour ${userFullName || ""}`}
        showCloseButton
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minHeight: 550, height: fullScreen ? "calc(100vh - 80px)" : "auto" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography fontWeight={600}>Contenu à personnaliser</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setOpenPreview(true)}
              disabled={fetching || !editedHtml}
            >
              Voir l’aperçu complet
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setFullScreen(!fullScreen)}
              startIcon={fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            >
              {fullScreen ? "Réduire" : "Plein écran"}
            </Button>
          </Stack>

          {fetching ? (
            <Box textAlign="center" py={3}><CircularProgress /></Box>
          ) : error ? (
            <Typography color="error" py={2}>{error.toString()}</Typography>
          ) : (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <CKEditor
                editor={ClassicEditor}
                data={editedHtml}
                config={{
                  toolbar: [
                    'heading', '|',
                    'bold', 'italic', 'underline', 'link', '|',
                    'bulletedList', 'numberedList', 'blockQuote', '|',
                    'insertTable', 'imageUpload', 'undo', 'redo'
                  ],
                  table: { contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ] }
                }}
                onChange={(event, editor) => {
                  setEditedHtml(editor.getData());
                }}
              />
              <Stack direction="row" justifyContent="flex-end" gap={2} mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGeneratePdf}
                  disabled={loading || !editedHtml.trim()}
                >
                  {loading ? <CircularProgress size={20} /> : "Générer le PDF & Valider"}
                </Button>
                {fullScreen && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setFullScreen(false)}
                    startIcon={<FullscreenExitIcon />}
                  >
                    Réduire
                  </Button>
                )}
              </Stack>
            </Box>
          )}
        </Box>
      </ModelComponent>

      {/* MODAL APERÇU COMPLET */}
      <ModelComponent
        open={openPreview}
        handleClose={() => setOpenPreview(false)}
        maxWidth="md"
        title="Aperçu du document (complet)"
        showCloseButton
      >
        <Box
          sx={{
            bgcolor: "#fff",
            color: "#111",
            p: 4,
            borderRadius: 2,
            boxShadow: 2,
            minHeight: 400,
            overflow: "auto",
            fontFamily: "Arial, sans-serif",
            fontSize: 17,
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: editedHtml }} />
        </Box>
      </ModelComponent>
    </>
  );
};

export default DocumentCustomModal;

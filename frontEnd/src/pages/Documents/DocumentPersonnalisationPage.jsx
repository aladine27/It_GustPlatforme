import React, { useEffect, useState } from "react";
import {
  Box, Button, Typography, Stack, CircularProgress, Menu, MenuItem,
  IconButton, Tooltip
} from "@mui/material";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


import { useDispatch, useSelector } from "react-redux";
import {
  fetchDocumentTemplate,
  generatePdfFromHtml,
  fetchAllDocuments
} from "../../redux/actions/documentAction";
import { toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PaletteIcon from '@mui/icons-material/Palette';
import WatermarkIcon from '@mui/icons-material/Opacity';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { StyledButton } from "../../style/style";
import SignaturePad from "react-signature-canvas"; // npm i react-signature-canvas
import CustomCKEditor from "./customCKEeditor";
const NAVBAR_HEIGHT = 64;

const THEMES = [
  { name: "Standard", color: "#1976d2", background: "#fff" },
  { name: "Corporate", color: "#212121", background: "#f2f7fe" },
  { name: "Sombre", color: "#fff", background: "#16213e" },
];

const WATERMARKS = [
  { name: "Aucun", value: "" },
  { name: "Confidentiel", value: "CONFIDENTIEL" },
  { name: "Copie interne", value: "COPIE INTERNE" },
];

const DocumentPersonnalisationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: docId } = useParams();
  const location = useLocation();
  const userFullName = location.state?.userFullName || "";
  const { loading, documents } = useSelector((state) => state.document);

  // Personnalisation
  const [themeIdx, setThemeIdx] = useState(0);
  const [watermark, setWatermark] = useState("");
  const [signatureData, setSignatureData] = useState(null);
  const [showSignature, setShowSignature] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // États classiques
  const [editedHtml, setEditedHtml] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [fullName, setFullName] = useState(userFullName);

  // Menus
  const [anchorEl, setAnchorEl] = useState(null);
  const [watermarkAnchor, setWatermarkAnchor] = useState(null);

  useEffect(() => {
    if (!userFullName && documents && docId) {
      const foundDoc = documents.find((d) => d._id === docId);
      setFullName(foundDoc?.user?.fullName || "");
    }
  }, [userFullName, documents, docId]);

  useEffect(() => {
    if (docId) {
      setFetching(true);
      setError(null);
      dispatch(fetchDocumentTemplate(docId))
        .unwrap()
        .then((html) => setEditedHtml(typeof html === "string" ? html : html?.data ?? ""))
        .catch((e) => {
          setError(e || "Erreur de chargement du template");
          toast.error(e || "Erreur de chargement du template");
          setEditedHtml("");
        })
        .finally(() => setFetching(false));
    }
  }, [docId, dispatch]);

  // Insertion QR dans l'éditeur
  const handleInsertQr = () => {
    const qrHtml = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=https://yourcompany.com/doc/${docId}" alt="QR code" style="display:inline-block;margin:10px 0;"/>`;
    setEditedHtml((prev) => prev + qrHtml);
  };

  // Insertion signature
  const handleSaveSignature = (ref) => {
    setSignatureData(ref.getTrimmedCanvas().toDataURL("image/png"));
    setShowSignature(false);
    toast.success("Signature ajoutée !");
  };

  // Générer PDF
  const handleGeneratePdf = async () => {
    try {
      await dispatch(generatePdfFromHtml({ id: docId, html: editedHtml })).unwrap();
      toast.success("Document PDF généré et stocké !");
      dispatch(fetchAllDocuments());
      navigate(-1);
    } catch (err) {
      toast.error(err || "Erreur lors de la génération du PDF");
    }
  };

  // Styles dynamiques
  const currentTheme = THEMES[themeIdx];

  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", bgcolor: "#f8fafc", overflow: "hidden", p: 0 }}>
      {/* Header sticky */}
      <Box
        sx={{
          px: 0, py: 1, minHeight: 44,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          bgcolor: "#f8fafc", borderBottom: "1.5px solid #e3e3e3", zIndex: 10, position: "sticky", top: 0,
        }}
      >
        <Typography fontWeight={800} color="primary" fontSize="1.15rem" noWrap>
          Personnaliser le document {fullName && `pour ${fullName}`}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Changer le thème">
            <IconButton color="primary" onClick={e => setAnchorEl(e.currentTarget)}><PaletteIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Ajouter un watermark">
            <IconButton onClick={e => setWatermarkAnchor(e.currentTarget)}><WatermarkIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Insérer un QR code">
            <IconButton onClick={() => setShowQr(true)}><QrCode2Icon /></IconButton>
          </Tooltip>
          <Button variant="outlined" size="small" onClick={() => setOpenPreview(true)}>Voir l’aperçu</Button>
          <Button variant="outlined" size="small"
            onClick={() => setFullScreen((v) => !v)}
            startIcon={fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}>
            {fullScreen ? "Réduire" : "Plein écran"}
          </Button>
          <Button variant="outlined" size="small" color="secondary" onClick={() => navigate("/dashboard/document")}>Retour</Button>
        </Stack>
        {/* Menu thème */}
        <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
          {THEMES.map((t, idx) => (
            <MenuItem key={t.name} onClick={() => { setThemeIdx(idx); setAnchorEl(null); }}>{t.name}</MenuItem>
          ))}
        </Menu>
        {/* Menu watermark */}
        <Menu open={!!watermarkAnchor} anchorEl={watermarkAnchor} onClose={() => setWatermarkAnchor(null)}>
          {WATERMARKS.map((w) => (
            <MenuItem key={w.value} onClick={() => { setWatermark(w.value); setWatermarkAnchor(null); }}>{w.name}</MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Modale QR code rapide */}
      {showQr && (
        <Box sx={{
          position: "fixed", inset: 0, zIndex: 2500, bgcolor: "rgba(10,30,70,0.16)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Box sx={{
            bgcolor: "#fff", borderRadius: 4, boxShadow: 4, p: 4, display: "flex", flexDirection: "column", alignItems: "center"
          }}>
            <Typography fontWeight={700} mb={2}>QR code pour ce document</Typography>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=190x190&data=https://yourcompany.com/doc/${docId}`} alt="QR" />
            <Stack direction="row" spacing={2} mt={3}>
              <Button variant="contained" onClick={() => { handleInsertQr(); setShowQr(false); }}>Insérer dans le document</Button>
              <Button variant="outlined" onClick={() => setShowQr(false)}>Fermer</Button>
            </Stack>
          </Box>
        </Box>
      )}

      {/* Modale signature électronique */}
      {showSignature && (
        <Box sx={{
          position: "fixed", inset: 0, zIndex: 2600, bgcolor: "rgba(10,10,30,0.22)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Box sx={{
            bgcolor: "#fff", borderRadius: 3, boxShadow: 4, p: 4, minWidth: 340, minHeight: 240
          }}>
            <Typography fontWeight={700} mb={2}>Signez ici</Typography>
            <SignaturePad
              penColor="#1976d2"
              canvasProps={{ width: 320, height: 140, style: { borderRadius: 8, border: "1.5px solid #1976d2" } }}
              ref={(ref) => window.sigRef = ref}
            />
            <Stack direction="row" spacing={2} mt={2}>
              <Button variant="contained" onClick={() => handleSaveSignature(window.sigRef)}>Valider</Button>
              <Button variant="outlined" onClick={() => setShowSignature(false)}>Annuler</Button>
            </Stack>
          </Box>
        </Box>
      )}

      {/* Zone principale */}
      <Box
        sx={{
          flex: 1, display: "flex", flexDirection: "column",
          width: "100%", minHeight: 0, minWidth: 0,
          background: currentTheme.background,
          borderRadius: 3,
          boxShadow: "0 6px 30px 0 rgba(25,118,210,0.10)",
          border: `1.5px solid ${currentTheme.color}40`,
          mx: "auto", my: 2,
          p: { xs: 1, sm: 2, md: 3 },
          position: fullScreen ? "fixed" : "relative",
          top: fullScreen ? 0 : undefined,
          left: fullScreen ? 0 : undefined,
          right: fullScreen ? 0 : undefined,
          bottom: fullScreen ? 0 : undefined,
          zIndex: fullScreen ? 2000 : undefined,
          width: fullScreen ? "100vw" : "100%",
          height: fullScreen ? "100vh" : "100%",
          overflow: "hidden",
        }}
      >
        {fetching ? (
          <Box flex={1} display="flex" alignItems="center" justifyContent="center"><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error" py={2}>{error.toString()}</Typography>
        ) : (
          <Box
            sx={{
              flex: 1, display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, overflow: "auto",
              "&::-webkit-scrollbar": { width: 9, background: "#eaf1fa", borderRadius: 8 },
              "&::-webkit-scrollbar-thumb": { background: "#b3d6fc", borderRadius: 8 },
              scrollbarColor: "#b3d6fc #eaf1fa", scrollbarWidth: "thin", position: "relative"
            }}
          >
           <Box
        sx={{
          flex: 1, display: "flex", flexDirection: "column",
          width: "100%", minHeight: 0, minWidth: 0,
          background: currentTheme.background,
          borderRadius: 3,
          boxShadow: "0 6px 30px 0 rgba(25,118,210,0.10)",
          border: `1.5px solid ${currentTheme.color}40`,
          mx: "auto", my: 2,
          p: { xs: 1, sm: 2, md: 3 },
          position: fullScreen ? "fixed" : "relative",
          top: fullScreen ? 0 : undefined,
          left: fullScreen ? 0 : undefined,
          right: fullScreen ? 0 : undefined,
          bottom: fullScreen ? 0 : undefined,
          zIndex: fullScreen ? 2000 : undefined,
     
          height: fullScreen ? "100vh" : "100%",
          overflow: "hidden",
        }}
      >
        {fetching ? (
          <Box flex={1} display="flex" alignItems="center" justifyContent="center"><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error" py={2}>{error.toString()}</Typography>
        ) : (
          <Box
            sx={{
              flex: 1, display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, overflow: "auto",
              "&::-webkit-scrollbar": { width: 9, background: "#eaf1fa", borderRadius: 8 },
              "&::-webkit-scrollbar-thumb": { background: "#b3d6fc", borderRadius: 8 },
              scrollbarColor: "#b3d6fc #eaf1fa", scrollbarWidth: "thin", position: "relative"
            }}
          >
            <Box
              sx={{
                flex: 1, minHeight: 0, minWidth: 0, display: "flex", flexDirection: "column",
                "& .ck-editor__editable": {
                  minHeight: 340, background: currentTheme.background,
                  borderRadius: 2, fontSize: "1.10rem", padding: "8px 12px",
                  color: currentTheme.color, overflowY: "auto",
                  maxHeight: fullScreen ? "calc(100vh - 150px)" : "calc(80vh - 100px)",
                  fontFamily: "Arial,Helvetica,sans-serif",
                },
                "& .ck-toolbar": { borderRadius: 2, mb: 1 },
              }}
            >
              <CustomCKEditor
                value={editedHtml}
                onChange={setEditedHtml}
                readOnly={loading}
              />
              <Stack direction="row" justifyContent="flex-end" gap={2} mt={3}>
                <StyledButton
                  onClick={handleGeneratePdf}
                  disabled={loading || !editedHtml.trim()}
                  sx={{ minWidth: 220, fontSize: "1.09rem", py: 1.2, borderRadius: 8 }}>
                  {loading ? <CircularProgress size={20} /> : "Générer le PDF & Valider"}
                </StyledButton>
              </Stack>
            </Box>
          </Box>
        )}
      </Box>
          </Box>
        )}
      </Box>

      {/* Aperçu modal (A4) */}
      {openPreview && (
        <Box
          sx={{
            position: "fixed",
            top: `${NAVBAR_HEIGHT}px`, // Sous la navbar
            left: 0, right: 0, bottom: 0,
            zIndex: 2500,
            bgcolor: "rgba(30,40,60,0.14)",
            display: "flex", alignItems: "center", justifyContent: "center",
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            width: "100vw",
            overflow: "auto",
          }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100vw",
              height: "100%",
              p: 0, m: 0, overflow: "auto",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "794px", height: "1123px", // A4
                bgcolor: currentTheme.background,
                borderRadius: "18px",
                boxShadow: "0 8px 40px 0 rgba(30,40,60,0.14)",
                overflow: "hidden",
                p: 0, m: 0,
                display: "flex",
                flexDirection: "column",
                color: currentTheme.color,
                fontFamily: "Arial,Helvetica,sans-serif",
                '@media (max-width:820px)': {
                  width: "98vw", height: "auto", minHeight: "60vw", maxHeight: "90vh"
                },
              }}
              id="a4-document-preview"
            >
              {/* Watermark si demandé */}
              {watermark && (
                <Box
                  sx={{
                    pointerEvents: "none", position: "absolute", top: 0, left: 0,
                    width: "100%", height: "100%", zIndex: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0.14, fontSize: "7rem", color: "#1976d2", fontWeight: 800, textTransform: "uppercase",
                  }}>
                  {watermark}
                </Box>
              )}
              {/* Fermer */}
              <Box sx={{ position: "absolute", top: 18, right: 22, zIndex: 11 }}>
                <Button variant="outlined" size="small" color="secondary" sx={{ borderRadius: 5, px: 2, fontWeight: 700 }} onClick={() => setOpenPreview(false)}>
                  Fermer
                </Button>
              </Box>
              {/* Contenu édité */}
              <Box
                sx={{
                  p: "44px 36px 34px 36px",
                  height: "100%",
                  width: "100%",
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "column",
                  "&::-webkit-scrollbar": { width: 10, background: "#eaf1fa", borderRadius: 9 },
                  "&::-webkit-scrollbar-thumb": { background: "#b3d6fc", borderRadius: 9 },
                  scrollbarColor: "#b3d6fc #eaf1fa", scrollbarWidth: "thin",
                }}
              >
                <div
                  style={{
                    minHeight: "100%",
                    height: "auto",
                    width: "100%",
                    boxSizing: "border-box",
                    color: currentTheme.color,
                    fontFamily: "Arial,Helvetica,sans-serif",
                  }}
                  dangerouslySetInnerHTML={{ __html: editedHtml }}
                />
                {/* Signature si ajoutée */}
                {signatureData && (
                  <img src={signatureData} alt="Signature" style={{
                    marginTop: 40, marginLeft: 16, width: 180, maxHeight: 70, objectFit: "contain", opacity: 0.9
                  }} />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DocumentPersonnalisationPage;

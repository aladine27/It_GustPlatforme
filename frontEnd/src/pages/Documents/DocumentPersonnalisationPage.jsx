import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
  fetchDocumentTemplate,
  generatePdfFromHtml,
  fetchAllDocuments
} from "../../redux/actions/documentAction";

import DocumentHeader from "../../components/Document/DocumentHeader";
import DocumentEditor from "../../components/Document/DocumentEditor";
import QrCodeModal from "../../components/Document/QrCodeModal";
import SignatureModal from "../../components/Document/SignatureModal";
import PreviewModal from "../../components/Document/PreviewModal";

// Minimal HTML sanitization for the editor: only remove style attributes
function sanitizeHtmlForEditor(rawHtml = "") {
  return rawHtml.replace(/style="[^"]*"/gi, "");
}

// Themes and watermarks
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

export default function DocumentPersonnalisationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: docId } = useParams();
  const location = useLocation();
  const userFullName = location.state?.userFullName || "";
  const { loading, documents } = useSelector((state) => state.document);

  // Main states
  const [themeIdx, setThemeIdx] = useState(0);
  const [watermark, setWatermark] = useState("");
  const [signatureData, setSignatureData] = useState(null);
  const [showSignature, setShowSignature] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [editedHtml, setEditedHtml] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  // Full name for header
  const [fullName, setFullName] = useState(userFullName);
  const [anchorEl, setAnchorEl] = useState(null);
  const [watermarkAnchor, setWatermarkAnchor] = useState(null);

  // Log state on mount
  useEffect(() => {
    console.log("[Page] userFullName(location):", userFullName);
    console.log("[Page] docId (URL):", docId);
    console.log("[Page] documents (redux):", documents);
    console.log("[Page] fullName (state):", fullName);
  }, []);

  // If no fullName, try to extract it from the current document
  useEffect(() => {
    if (!userFullName && documents && docId) {
      const foundDoc = documents.find((d) => d._id === docId);
      setFullName(foundDoc?.user?.fullName || "");
      console.log("[useEffect - setFullName] foundDoc :", foundDoc);
    }
  }, [userFullName, documents, docId]);

  // Keep the "rich" version of HTML for the PDF preview
  const [originalHtml, setOriginalHtml] = useState("");

  // Load the template when docId is available and sanitize HTML for the editor
  function setEditedHtmlLogged(val) {
    console.log("[setEditedHtmlLogged] Changement demandé :", val?.substring(0, 200));
    setEditedHtml(val);
  }

  useEffect(() => {
    if (docId) {
      setFetching(true);
      setError(null);
      console.log("[useEffect fetchDocumentTemplate] Appel dispatch(fetchDocumentTemplate) avec docId:", docId);
      dispatch(fetchDocumentTemplate(docId))
        .unwrap()
        .then((html) => {
          let rawHtml = typeof html === "string" ? html : html?.data ?? "";
          console.log("[useEffect fetchDocumentTemplate] HTML reçu (raw) :", rawHtml?.substring(0, 200));
          setOriginalHtml(rawHtml); // For preview
          let cleanedHtml = sanitizeHtmlForEditor(rawHtml);
          console.log("[useEffect fetchDocumentTemplate] HTML nettoyé :", cleanedHtml?.substring(0, 200));
          setEditedHtmlLogged(cleanedHtml);
        })
        .catch((e) => {
          setError(e || "Erreur de chargement du template");
          toast.error(e || "Erreur de chargement du template");
          setEditedHtmlLogged(""); // Avoid editor crash with empty content
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [docId, dispatch]);

  // Log the editedHtml state value on each update
  useEffect(() => {
    console.log("[Page] editedHtml (state) :", editedHtml?.substring(0, 200));
  }, [editedHtml]);

  // Insert QR code
  const handleInsertQr = () => {
    const qrHtml = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=https://yourcompany.com/doc/${docId}" alt="QR code" />`;
    setEditedHtml((prev) => prev + qrHtml);
    setShowQr(false);
  };

  // Save signature
  const handleSaveSignature = (dataUrl) => {
    setSignatureData(dataUrl);
    setShowSignature(false);
    toast.success("Signature ajoutée !");
  };

  // Generate PDF
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

  const currentTheme = THEMES[themeIdx];

  return (
    <Box sx={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      bgcolor: "#f8fafc",
      overflow: "hidden",
      p: 0
    }}>
      {/* HEADER */}
      <DocumentHeader
        fullName={fullName}
        themeIdx={themeIdx}
        setAnchorEl={setAnchorEl}
        setWatermarkAnchor={setWatermarkAnchor}
        setShowQr={setShowQr}
        setOpenPreview={setOpenPreview}
        setFullScreen={setFullScreen}
        fullScreen={fullScreen}
        navigate={navigate}
        THEMES={THEMES}
        WATERMARKS={WATERMARKS}
        anchorEl={anchorEl}
        watermarkAnchor={watermarkAnchor}
        setThemeIdx={setThemeIdx}
        setWatermark={setWatermark}
      />

      {/* MODALS */}
      <QrCodeModal open={showQr} onInsert={handleInsertQr} onClose={() => setShowQr(false)} docId={docId} />
      <SignatureModal open={showSignature} onValidate={handleSaveSignature} onClose={() => setShowSignature(false)} />
      {/* PDF preview uses the rich version, not the editor-modified one */}
      <PreviewModal open={openPreview} onClose={() => setOpenPreview(false)} html={ editedHtml} signatureData={signatureData} theme={currentTheme} watermark={watermark} />

      {/* Editor (sanitized HTML specifically for PrimeReact Editor) */}
      <DocumentEditor
        editedHtml={editedHtml}
        setEditedHtml={setEditedHtml}
        loading={loading}
        fetching={fetching}
        error={error}
        handleGeneratePdf={handleGeneratePdf}
        fullScreen={fullScreen}
        currentTheme={currentTheme}
      />
    </Box>
  );
}
import React, { useEffect, useState, useRef } from "react";
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
import FullScreenPortal from "../../components/Global/FullScreenPortal";

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

  const [themeIdx, setThemeIdx] = useState(0);
  const [watermark, setWatermark] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [editedHtml, setEditedHtml] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [fullName, setFullName] = useState(userFullName);
  const [anchorEl, setAnchorEl] = useState(null);
  const [watermarkAnchor, setWatermarkAnchor] = useState(null);
  const editorRef = useRef(null); 
  const [signatureData, setSignatureData] = useState(null);


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
        .then((html) => {
          let rawHtml = typeof html === "string" ? html : html?.data ?? "";
          setEditedHtml(rawHtml);
        })
        .catch((e) => {
          setError(e || "Erreur de chargement du template");
          toast.error(e || "Erreur de chargement du template");
          setEditedHtml("");
        })
        .finally(() => setFetching(false));
    }
  }, [docId, dispatch]);

  useEffect(() => {
    if (fullScreen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [fullScreen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && fullScreen) setFullScreen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [fullScreen]);

  const handleInsertQr = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=https://yourcompany.com/doc/${docId}`;
    if (editorRef.current) {
      editorRef.current.chain().focus().setImage({ src: qrUrl, alt: "QR code" }).run();
      setShowQr(false);
      toast.success("QR code inséré !");
    } else {
      toast.error("Éditeur non prêt");
    }
  };

  const handleSaveSignature = (dataUrl) => {
    setShowSignature(false);
    if (!dataUrl) {
      toast.error("Aucune signature détectée");
      return;
    }
    setSignatureData(dataUrl);
    // Remplacement du src de l'image signature
    setEditedHtml((prevHtml) =>
      prevHtml.replace(
        /<img([^>]+id="signature-placeholder"[^>]*)src="[^"]*"([^>]*)>/,
        `<img$1src="${dataUrl}"$2>`
      )
    );
    toast.success("Signature ajoutée !");
  };
  
  
  
  
  
  

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

  const renderContent = () => (
    <Box sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }}>
      <DocumentHeader
        fullName={fullName}
        themeIdx={themeIdx}
        setAnchorEl={setAnchorEl}
        setWatermarkAnchor={setWatermarkAnchor}
        setShowQr={setShowQr}
        setShowSignature={setShowSignature}
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

      <QrCodeModal
        open={showQr}
        onInsert={handleInsertQr}
        onClose={() => setShowQr(false)}
        docId={docId}
      />
      <SignatureModal
        open={showSignature}
        onValidate={handleSaveSignature}
        onClose={() => setShowSignature(false)}
      />
      <PreviewModal
  open={openPreview}
  onClose={() => setOpenPreview(false)}
  html={editedHtml}
  theme={THEMES[themeIdx]}
  watermark={watermark}
/>


      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <DocumentEditor
          editedHtml={editedHtml}
          setEditedHtml={setEditedHtml}
          loading={loading}
          fetching={fetching}
          error={error}
          handleGeneratePdf={handleGeneratePdf}
          fullScreen={fullScreen}
          currentTheme={THEMES[themeIdx]}
          openPreview={openPreview}
          forceToolbarTop={fullScreen}
          onEditorReady={(editor) => { editorRef.current = editor; }} 
          signatureData={signatureData} 

        />
      </Box>
    </Box>
  );

  return (
    <>
      <FullScreenPortal open={fullScreen}>
        <Box sx={{
          height: "100vh",
          width: "100vw",
          bgcolor: "#fff",
          overflow: "hidden",
          position: "relative"
        }}>
          {renderContent()}
        </Box>
      </FullScreenPortal>
      {!fullScreen && (
        <Box sx={{
          height: "100%",
          width: "100%",
          bgcolor: "#f8fafc",
          overflow: "hidden"
        }}>
          {renderContent()}
        </Box>
      )}
    </>
  );
}
import React from "react";
import { Box, Button } from "@mui/material";

const NAVBAR_HEIGHT = 64;

export default function PreviewModal({ open, onClose, html, signatureData, theme, watermark }) {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: `${NAVBAR_HEIGHT}px`,
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
            bgcolor: theme.background,
            borderRadius: "18px",
            boxShadow: "0 8px 40px 0 rgba(30,40,60,0.14)",
            overflow: "hidden",
            p: 0, m: 0,
            display: "flex",
            flexDirection: "column",
            color: theme.color,
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
            <Button variant="outlined" size="small" color="secondary" sx={{ borderRadius: 5, px: 2, fontWeight: 700 }} onClick={onClose}>
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
                color: theme.color,
                fontFamily: "Arial,Helvetica,sans-serif",
              }}
              // Le HTML généré par le backend contient le footer aligné à gauche/droite selon la structure du template.
              dangerouslySetInnerHTML={{ __html: html }}
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
  );
}
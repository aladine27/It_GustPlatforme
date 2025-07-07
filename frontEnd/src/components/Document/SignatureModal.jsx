import { useRef, useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import SignaturePad from "react-signature-canvas";
import logo from "../../assets/logo.jpeg"; // Ton logo

export default function SignatureModal({ open, onValidate, onClose }) {
  const sigRef = useRef();
  const stampRef = useRef();

  // Fonction pour dessiner le texte circulaire autour du tampon
  function drawCircularText(ctx, text, centerX, centerY, radius, startAngle) {
    ctx.save();
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#ce2828";
    ctx.textAlign = "center";
    const chars = text.split("");
    const angleDecrement = (Math.PI * 2) / chars.length;
    let angle = startAngle;
    chars.forEach(char => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.textBaseline = "middle";
      ctx.fillText(char, 0, -radius);
      ctx.restore();
      angle += angleDecrement;
    });
    ctx.restore();
  }

  // Dessine le tampon avec le logo au centre et le texte autour
  useEffect(() => {
    if (!open) return;

    const canvas = stampRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 180, 180);

    // Double cercle rouge
    ctx.beginPath();
    ctx.arc(90, 90, 78, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#ce2828";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(90, 90, 66, 0, 2 * Math.PI);
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = "#ce2828";
    ctx.stroke();

    // Texte circulaire tout autour du cercle
    const customText = "ENTREPRISE • SIGNATURE OFFICIELLE • DOCUMENT CERTIFIÉ •";
    drawCircularText(
      ctx,
      customText,
      90, 90, 70,
      -Math.PI / 2 // Commence en haut
    );

    // Logo centré et bien visible
    const img = new window.Image();
    img.src = logo;
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(90, 90, 62, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 28, 28, 124, 124);
      ctx.restore();

      // Date bien visible sous le logo
      ctx.save();
      ctx.font = "bold 16px Arial";
      ctx.fillStyle = "#ce2828";
      ctx.textAlign = "center";
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 4.5;
      const dateText = new Date().toLocaleDateString("fr-FR");
      // Effet contour blanc pour lisibilité
      ctx.strokeText(dateText, 90, 160);
      ctx.fillText(dateText, 90, 160);
      ctx.restore();
    };
  }, [open]);


  const handleValidate = () => {
    if (!sigRef.current.isEmpty()) {
      const stampCanvas = stampRef.current;
      const sigCanvas = sigRef.current.getTrimmedCanvas();
  
      // Pour éviter un fond noir, on va traiter le canvas de signature en pixel par pixel
      // Création d'un canvas temporaire
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = sigCanvas.width;
      tempCanvas.height = sigCanvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.drawImage(sigCanvas, 0, 0);
  
      // On convertit tous les pixels non transparents en noir pur
      const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        // Seulement si alpha > 0 (pixel dessiné)
        if (imgData.data[i + 3] > 50) {
          imgData.data[i] = 0;   // R
          imgData.data[i + 1] = 0; // G
          imgData.data[i + 2] = 0; // B
          imgData.data[i + 3] = 210; // (optionnel: opacité, sinon laisse comme c'est)
        }
      }
      tempCtx.putImageData(imgData, 0, 0);
  
      // Canvas final
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = 180;
      finalCanvas.height = 180;
      const ctx = finalCanvas.getContext("2d");
  
      // Dessine le tampon
      ctx.drawImage(stampCanvas, 0, 0, 180, 180);
  
      // Position et taille de la signature
      const sigWidth = 95;
      const sigHeight = 27;
      const sigX = 90 - sigWidth / 2;
      const sigY = 100;
  
      // Dessine la signature traitée en noir, fond transparent
      ctx.drawImage(tempCanvas, sigX, sigY, sigWidth, sigHeight);
  
      const resultDataUrl = finalCanvas.toDataURL("image/png");
      onValidate(resultDataUrl);
    } else {
      onClose();
    }
  };
  

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2600,
        bgcolor: "rgba(10,10,30,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: 4,
          p: 4,
          minWidth: 240,
          minHeight: 290,
        }}
      >
        <Typography fontWeight={700} mb={2} textAlign="center">
          Tampon Signature Personnalisé
        </Typography>

        <canvas
          ref={stampRef}
          width={180}
          height={180}
          style={{
            display: "block",
            margin: "0 auto 12px auto",
            background: "#fff",
          }}
        />

        <SignaturePad
          penColor="#111"
          canvasProps={{
            width: 180,
            height: 64,
            style: {
              borderRadius: 8,
              border: "1.5px solid #aaa",
              backgroundColor: "#f8fafc",
              display: "block",
              margin: "0 auto",
            },
          }}
          ref={sigRef}
        />

        <Stack direction="row" spacing={2} mt={2} justifyContent="center">
          <Button variant="contained" onClick={handleValidate}>
            Valider
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Annuler
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

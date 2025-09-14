import React from "react";
import { 
  Box, 
  Typography, 
  Stack, 
  IconButton, 
  Tooltip, 
  Button, 
  Menu, 
  MenuItem 
} from "@mui/material";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PaletteIcon from '@mui/icons-material/Palette';
import WatermarkIcon from '@mui/icons-material/Opacity';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PreviewIcon from '@mui/icons-material/Preview';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function DocumentHeader({
  fullName,
  themeIdx,
  setAnchorEl,
  setWatermarkAnchor,
  setShowQr,
  setShowSignature,
  setOpenPreview,
  setFullScreen,
  fullScreen,
  navigate,
  THEMES,
  WATERMARKS,
  anchorEl,
  watermarkAnchor,
  setThemeIdx,
  setWatermark
}) {
  
  // Debug : vérifier la valeur de fullScreen
  console.log("DocumentHeader - fullScreen:", fullScreen);
  
  const handleExitFullScreen = () => {
    console.log("Clic sur retour au mode normal");
    setFullScreen(false);
  };

  const handleEnterFullScreen = () => {
    console.log("Clic sur plein écran");
    setFullScreen(true);
  };

  return (
    <Box sx={{
      px: 2,
      py: 1,
      minHeight: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      bgcolor: "#fff",
      borderBottom: "1px solid #e0e0e0",
      zIndex: fullScreen ? 2501 : 1100,      // s'assure que la barre reste au-dessus
      position: fullScreen ? "fixed" : "sticky", // sticky en mode normal, fixed en plein écran
      top: 0,
      left: fullScreen ? 0 : undefined,      // full width en fixed
      right: fullScreen ? 0 : undefined,
      width: fullScreen ? "100vw" : "auto",  // toute la largeur en plein écran
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }}>
    
      
      {/* Titre */}
      <Typography 
        variant="h6"
        color="primary" 
        sx={{ 
          fontWeight: 600,
          flexGrow: 1,
          mr: 2
        }}
      >
        {fullScreen ? "Mode Plein Écran" : "Personnaliser le document"} 
        {fullName && ` pour ${fullName}`}
      </Typography>

      {/* Conteneur des boutons avec debug visuel */}
      <Box sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: fullScreen ? "rgba(255,0,0,0.1)" : "transparent", // Rouge léger en mode plein écran pour debug
        p: 1,
        borderRadius: 1
      }}>
        
        {/* MODE NORMAL - Tous les boutons */}
        {!fullScreen && (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Changer le thème">
              <IconButton color="primary" onClick={e => setAnchorEl(e.currentTarget)}>
                <PaletteIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Ajouter un watermark">
              <IconButton onClick={e => setWatermarkAnchor(e.currentTarget)}>
                <WatermarkIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Insérer un QR code">
              <IconButton onClick={() => setShowQr(true)}>
                <QrCode2Icon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Insérer une signature">
              <IconButton onClick={() => setShowSignature(true)}>
                <BorderColorIcon />
              </IconButton>
            </Tooltip>
            
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => setOpenPreview(true)}
              sx={{ textTransform: 'none' }}
            >
              Aperçu
            </Button>
            
            <Button 
              variant="contained" 
              size="small"
              onClick={handleEnterFullScreen}
              startIcon={<FullscreenIcon />}
              sx={{ 
                textTransform: 'none',
                bgcolor: 'success.main',
                '&:hover': { bgcolor: 'success.dark' }
              }}
            >
              Plein écran
            </Button>
            
             <Button
            variant="outlined"
            size="small"
            onClick={() =>
              navigate('/dashboard/document', { state: { view: 'traitement' } })
            }
            startIcon={<ArrowBackIcon />}
            sx={{ textTransform: 'none' }}
          >
            Retour
          </Button>
          </Stack>
        )}
        
        {/* MODE PLEIN ÉCRAN - Bouton de retour FORCÉ */}
        {fullScreen && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleExitFullScreen}
            startIcon={<FullscreenExitIcon />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              px: 3,
              py: 1.5,
              bgcolor: 'error.main',
              color: 'white',
              border: '2px solid white',
              '&:hover': { 
                bgcolor: 'error.dark',
                transform: 'scale(1.05)'
              },
              // Forcer la visibilité
              position: 'relative',
              zIndex: 10000
            }}
          >
            Retour au mode normal
          </Button>
        )}

        {/* Debug : Afficher la valeur de fullScreen */}
        <Box sx={{
          ml: 2,
          px: 1,
          py: 0.5,
          bgcolor: fullScreen ? 'error.main' : 'success.main',
          color: 'white',
          borderRadius: 1,
          fontSize: '0.7rem',
          fontWeight: 'bold'
        }}>
          {fullScreen ? 'PLEIN ÉCRAN' : 'NORMAL'}
        </Box>
      </Box>

      {/* Menus - Seulement en mode normal */}
      {!fullScreen && (
        <>
          <Menu 
            open={!!anchorEl} 
            anchorEl={anchorEl} 
            onClose={() => setAnchorEl(null)}
          >
            {THEMES.map((theme, idx) => (
              <MenuItem 
                key={theme.name} 
                onClick={() => { 
                  setThemeIdx(idx); 
                  setAnchorEl(null); 
                }}
                selected={idx === themeIdx}
              >
                {theme.name}
              </MenuItem>
            ))}
          </Menu>

          <Menu 
            open={!!watermarkAnchor} 
            anchorEl={watermarkAnchor} 
            onClose={() => setWatermarkAnchor(null)}
          >
            {WATERMARKS.map((watermark) => (
              <MenuItem 
                key={watermark.value || 'none'} 
                onClick={() => { 
                  setWatermark(watermark.value); 
                  setWatermarkAnchor(null); 
                }}
              >
                {watermark.name}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
}
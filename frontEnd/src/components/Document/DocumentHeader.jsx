import { Box, Typography, Stack, IconButton, Tooltip, Button, Menu, MenuItem } from "@mui/material";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PaletteIcon from '@mui/icons-material/Palette';
import WatermarkIcon from '@mui/icons-material/Opacity';
import QrCode2Icon from '@mui/icons-material/QrCode2';

export default function DocumentHeader({
  fullName,
  themeIdx,
  setAnchorEl,
  setWatermarkAnchor,
  setShowQr,
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
  return (
    <Box sx={{
      px: 0, py: 1, minHeight: 44,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      bgcolor: "#f8fafc", borderBottom: "1.5px solid #e3e3e3", zIndex: 10, position: "sticky", top: 0,
    }}>
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
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        {THEMES.map((t, idx) => (
          <MenuItem key={t.name} onClick={() => { setThemeIdx(idx); setAnchorEl(null); }}>{t.name}</MenuItem>
        ))}
      </Menu>
      <Menu open={!!watermarkAnchor} anchorEl={watermarkAnchor} onClose={() => setWatermarkAnchor(null)}>
        {WATERMARKS.map((w) => (
          <MenuItem key={w.value} onClick={() => { setWatermark(w.value); setWatermarkAnchor(null); }}>{w.name}</MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

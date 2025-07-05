import React, { useEffect, useRef } from "react";
import { Box, Stack, CircularProgress, Typography, IconButton, Tooltip, Input } from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HighlightIcon from "@mui/icons-material/Highlight";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import ImageIcon from "@mui/icons-material/Image";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { StyledButton } from "../../style/style";
import ResizeImage from "tiptap-extension-resize-image";
export default function DocumentEditor({
  editedHtml,
  setEditedHtml,
  loading,
  fetching,
  error,
  handleGeneratePdf,
  fullScreen,
  currentTheme,
  readOnly = false,
}) {
  const fileInputRef = useRef();

  // Tiptap extensions
  const extensions = [
    StarterKit.configure({
      history: true,
      heading: { levels: [1, 2, 3] },
    }),
    Underline,
    Link.configure({ openOnClick: true }),
    Image.configure({ allowBase64: true }),
    Color,
    TextStyle,
    Highlight,
    HorizontalRule,
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right", "justify"],
    }),
    ResizeImage,
  ];

  // Editor instance
  const editor = useEditor({
    extensions,
    content: editedHtml || "<p></p>",
    editable: !loading && !readOnly,
    autofocus: true,
    onUpdate({ editor }) {
      setEditedHtml(editor.getHTML());
    },
  });

  // Sync content if editedHtml changes
  useEffect(() => {
    if (editor && typeof editedHtml === "string" && editor.getHTML() !== editedHtml) {
      editor.commands.setContent(editedHtml || "<p></p>");
    }
    // eslint-disable-next-line
  }, [editedHtml]);

  // Clean up on unmount
  useEffect(() => {
    return () => editor?.destroy();
  }, []);

  // Insert image from local file
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box
      sx={{
        flex: 1, display: "flex", flexDirection: "column",
        minHeight: 0, minWidth: 0,
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
        <Box flex={1} display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
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
              "& .MuiTiptap-root": {
                minHeight: 340, background: currentTheme.background,
                borderRadius: 2, fontSize: "1.10rem", padding: "8px 12px",
                color: "#232323", overflowY: "auto",
                maxHeight: fullScreen ? "calc(100vh - 150px)" : "calc(80vh - 100px)",
                fontFamily: "Arial,Helvetica,sans-serif",
              }
            }}
          >
            {/* Barre d'édition personnalisée */}
            {!readOnly && editor && (
              <Box sx={{
                display: "flex", alignItems: "center", py: 2, px: 1, mb: 1, borderBottom: "1px solid #eee", gap: 1, flexWrap: "wrap",
              }}>
                <Tooltip title="Gras"><IconButton onClick={() => editor.chain().focus().toggleBold().run()}><FormatBoldIcon /></IconButton></Tooltip>
                <Tooltip title="Italique"><IconButton onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalicIcon /></IconButton></Tooltip>
                <Tooltip title="Souligné"><IconButton onClick={() => editor.chain().focus().toggleUnderline().run()}><FormatUnderlinedIcon /></IconButton></Tooltip>
                <Tooltip title="Titre 1"><IconButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>T1</IconButton></Tooltip>
                <Tooltip title="Titre 2"><IconButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>T2</IconButton></Tooltip>
                <Tooltip title="Titre 3"><IconButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>T3</IconButton></Tooltip>
                <Tooltip title="Liste à puces"><IconButton onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulletedIcon /></IconButton></Tooltip>
                <Tooltip title="Liste numérotée"><IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumberedIcon /></IconButton></Tooltip>
                <Tooltip title="Citation"><IconButton onClick={() => editor.chain().focus().toggleBlockquote().run()}><FormatQuoteIcon /></IconButton></Tooltip>
                <Tooltip title="Surlignage"><IconButton onClick={() => editor.chain().focus().toggleHighlight().run()}><HighlightIcon /></IconButton></Tooltip>
                <Tooltip title="Trait horizontal"><IconButton onClick={() => editor.chain().focus().setHorizontalRule().run()}><HorizontalRuleIcon /></IconButton></Tooltip>
                <Tooltip title="Couleur du texte">
                  <input type="color" onChange={e => editor.chain().focus().setColor(e.target.value).run()} style={{ width: 28, height: 28, border: "none", background: "none" }} />
                </Tooltip>
                <Tooltip title="Aligner à gauche"><IconButton onClick={() => editor.chain().focus().setTextAlign("left").run()}><FormatAlignLeftIcon /></IconButton></Tooltip>
                <Tooltip title="Centrer"><IconButton onClick={() => editor.chain().focus().setTextAlign("center").run()}><FormatAlignCenterIcon /></IconButton></Tooltip>
                <Tooltip title="Aligner à droite"><IconButton onClick={() => editor.chain().focus().setTextAlign("right").run()}><FormatAlignRightIcon /></IconButton></Tooltip>
                <Tooltip title="Justifier"><IconButton onClick={() => editor.chain().focus().setTextAlign("justify").run()}><FormatAlignJustifyIcon /></IconButton></Tooltip>
                {/* Image upload */}
                <Tooltip title="Image">
                  <IconButton onClick={() => fileInputRef.current.click()}><ImageIcon /></IconButton>
                </Tooltip>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                <Tooltip title="Annuler"><IconButton onClick={() => editor.chain().focus().undo().run()}><UndoIcon /></IconButton></Tooltip>
                <Tooltip title="Rétablir"><IconButton onClick={() => editor.chain().focus().redo().run()}><RedoIcon /></IconButton></Tooltip>
              </Box>
            )}

            {/* Zone d'édition */}
            <EditorContent editor={editor} className="MuiTiptap-root" />

            {/* Bouton de validation */}
            {!readOnly && (
              <Stack direction="row" justifyContent="flex-end" gap={2} mt={3}>
                <StyledButton
                  onClick={handleGeneratePdf}
                  disabled={loading || !editedHtml.trim()}
                  sx={{ minWidth: 220, fontSize: "1.09rem", py: 1.2, borderRadius: 8 }}>
                  {loading ? <CircularProgress size={20} /> : "Générer le PDF & Valider"}
                </StyledButton>
              </Stack>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

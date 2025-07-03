// src/helpers/htmlSanitizer.js
export function sanitizeHtmlForEditor(rawHtml = "") {
    let html = rawHtml;
    // Debug
    console.log("[sanitizeHtmlForEditor] HTML brut reçu :", html?.substring(0, 200));
    
    html = html
      .replace(/<div/gi, '<p')
      .replace(/<\/div>/gi, '</p>')
      .replace(/background(-color)?:\s*#fff(fff)?/gi, '')
      .replace(/max-width\s*:\s*\d+px;?/gi, '')
      .replace(/color\s*:\s*white;?/gi, '')
      .replace(/style="[^"]*"/gi, (match) => {
        return match.replace(/(background(-color)?|color\s*:\s*white|max-width)[^;"]*;?/gi, '');
      });
    html = html.replace(/style="\s*"/gi, '');
  
    // Debug
    console.log("[sanitizeHtmlForEditor] HTML nettoyé :", html?.substring(0, 200));
    return html;
  }
  
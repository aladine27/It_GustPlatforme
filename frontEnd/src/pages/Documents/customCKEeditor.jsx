import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CustomCKEditor = ({ value, onChange, readOnly = false }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={{
        toolbar: [
          'heading', '|',
          'bold', 'italic', 'underline', '|',
          'fontColor', 'fontBackgroundColor', 'fontFamily', 'fontSize', '|',
          'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
          'insertTable', 'imageUpload', 'undo', 'redo'
        ],
        fontColor: {
          colors: [
            { color: '#181818', label: 'Noir' },
            { color: '#1976d2', label: 'Bleu ITGUST' },
            { color: '#e53935', label: 'Rouge' },
            { color: '#388e3c', label: 'Vert' },
            { color: '#ffb300', label: 'Orange' },
            { color: '#fff', label: 'Blanc' },
          ],
          columns: 6, documentColors: 6,
        },
        fontBackgroundColor: {
          colors: [
            { color: '#fff', label: 'Blanc' },
            { color: '#fafdff', label: 'Gris clair' },
            { color: '#e3e3e3', label: 'Gris' },
            { color: '#1976d2', label: 'Bleu ITGUST' },
            { color: '#e53935', label: 'Rouge' },
            { color: '#388e3c', label: 'Vert' },
          ],
          columns: 6, documentColors: 6,
        },
        fontSize: {
          options: [10, 12, 14, 'default', 18, 20, 22, 24, 28, 32, 36, 40, 48],
          supportAllValues: false
        },
        fontFamily: {
          options: [
            'default', 'Arial, Helvetica, sans-serif', 'Courier New, Courier, monospace',
            'Georgia, serif', 'Lucida Sans Unicode, Lucida Grande, sans-serif', 'Tahoma, Geneva, sans-serif',
            'Times New Roman, Times, serif', 'Trebuchet MS, Helvetica, sans-serif', 'Verdana, Geneva, sans-serif'
          ],
          supportAllValues: true
        },
        table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'] }
      }}
      disabled={readOnly}
      onChange={(_, editor) => {
        onChange(editor.getData());
      }}
    />
  );
};

export default CustomCKEditor;

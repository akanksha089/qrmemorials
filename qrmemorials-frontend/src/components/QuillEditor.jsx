// QuillEditor.jsx
import React, { useEffect, useRef, useState } from 'react';
import 'quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';

import katex from 'katex';

window.katex = katex;

let Quill = null;

const loadHighlightJS = async () => {
  if (!window.hljs) {
    await new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }
};

const loadQuill = async () => {
  if (!Quill) {
    Quill = (await import('quill')).default;
  }
  return Quill;
};

const QuillEditor = ({ formData, handleChange }) => {
  const editorRef = useRef(null);
  const [quillInstance, setQuillInstance] = useState(null);

  useEffect(() => {
    (async () => {
      await loadHighlightJS();
      await loadQuill();

      if (!editorRef.current) return;

      const toolbarOptions = [
        [{ font: [] }, { size: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ header: 1 }, { header: 2 }, 'blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }, { align: [] }],
        ['link', 'image', 'video', 'formula'],
        ['clean'],
      ];

      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          syntax: true, // Now hljs is definitely available on window
          toolbar: toolbarOptions,
          formula: true,
        },
      });
      quill.clipboard.dangerouslyPasteHTML(formData.biography_text || '');

    // Update formData on text change
      quill.on('text-change', () => {
        const html = editorRef.current.querySelector('.ql-editor')?.innerHTML || '';
        handleChange({
          target: {
            name: 'biography_text',
            value: html,
          }
        });
      });
      setQuillInstance(quill);
    })();
  }, []);

  useEffect(() => {
  if (quillInstance && formData.biography_text) {
    quillInstance.clipboard.dangerouslyPasteHTML(formData.biography_text);
  }
}, [formData.biography_text, quillInstance]);

  return (
    <div id="standalone-container">
      <div
        id="editor"
        ref={editorRef}
        style={{
          height: '220px',
          backgroundColor: 'white',
          color: 'black',
        }}
      />
    </div>
  );
};

export default QuillEditor;

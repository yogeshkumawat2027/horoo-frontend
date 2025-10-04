"use client";
import { useEffect, useRef, useState } from 'react';

const QuillEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Enter description...', 
  showPreview = true,
  label = 'Description'
}) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [content, setContent] = useState(value);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && editorRef.current && !quillRef.current) {
      // Dynamically import and initialize Quill only on client side
      const initQuill = async () => {
        const Quill = (await import('quill')).default;
        
        // Import Quill CSS
        await import('quill/dist/quill.snow.css');
        
        quillRef.current = new Quill(editorRef.current, {
          theme: 'snow',
          placeholder: placeholder,
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['clean']
            ]
          },
          formats: [
            'bold', 'italic', 'underline', 'list'
          ]
        });

        // Set initial content
        if (value) {
          quillRef.current.root.innerHTML = value;
        }

        // Listen for text changes
        quillRef.current.on('text-change', () => {
          const htmlContent = quillRef.current.root.innerHTML;
          setContent(htmlContent);
          if (onChange) {
            onChange(htmlContent);
          }
        });
      };

      initQuill();
    }
  }, [isClient, placeholder, value, onChange]);

  // Update editor content when value prop changes
  useEffect(() => {
    if (quillRef.current && value !== content) {
      quillRef.current.root.innerHTML = value;
      setContent(value);
    }
  }, [value]);

  if (!isClient) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <p className="text-gray-500">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {/* Quill Editor */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div ref={editorRef} style={{ minHeight: '120px' }} />
      </div>
      
      {/* Live Preview */}
      {showPreview && content && (
        <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
          <h4 className="text-sm font-medium text-orange-800 mb-2">Preview:</h4>
          <div 
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
    </div>
  );
};

export default QuillEditor;
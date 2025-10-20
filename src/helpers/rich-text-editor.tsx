/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
}

export function RichTextEditor({
  value,
  onChange,
  height = 500,
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      apiKey="ykhuoumhxijb5c37u9udtcc70jlloo3qq5tat84z4d3v3cv2"
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={onChange}
      init={{
        height,
        menubar: false, // Simplify the menu
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | bold italic | " +
          "alignleft aligncenter alignright | " +
          "bullist numlist | link image | " +
          "code | removeformat | help",
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            font-size: 16px; 
            line-height: 1.6;
          }
          h1 { font-size: 2em; margin: 0.67em 0; }
          h2 { font-size: 1.5em; margin: 0.75em 0; }
          h3 { font-size: 1.17em; margin: 0.83em 0; }
          pre { 
            background: #f5f5f5; 
            padding: 1em; 
            border-radius: 4px; 
            overflow-x: auto;
          }
          code { 
            font-family: 'Courier New', monospace; 
            background: #f5f5f5; 
            padding: 2px 4px; 
            border-radius: 2px;
          }
        `,
        placeholder: "Start writing your post content here...",
        branding: false,
        statusbar: false,
        elementpath: false,
        paste_data_images: false,
        // Clean up the output
        invalid_elements: "script,style",
        valid_elements: "*[*]",
        extended_valid_elements: "pre[class],code[class]",
        // Better code handling
        codesample_languages: [
          { text: "JavaScript", value: "javascript" },
          { text: "HTML/XML", value: "html" },
          { text: "CSS", value: "css" },
          { text: "TypeScript", value: "typescript" },
        ],
      }}
    />
  );
}

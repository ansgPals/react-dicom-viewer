import styled from "@emotion/styled";
import React, { useRef, useState } from "react";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  webkitdirectory?: string;
  directory?: string;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesSelected,
  accept,
  multiple,
  label = "파일을 선택하거나 드래그하세요",
  webkitdirectory,
  directory,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) onFilesSelected(Array.from(files));
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) onFilesSelected(Array.from(files));
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };
  const onClickButton = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <DropZone
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      dragActive={dragActive}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInput}
        style={{ display: "none" }}
        {...(webkitdirectory ? { webkitdirectory } : {})}
        {...(directory ? { directory } : {})}
      />
      <UploadButton as="button" onClick={onClickButton}>
        {label}
      </UploadButton>
    </DropZone>
  );
};

export default UploadZone;

const DropZone = styled.div<{ dragActive: boolean }>`
  width: 500px;
  height: 100px;
  border: 2px dashed ${(props) => (props.dragActive ? "#007bff" : "#dee2e6")};
  border-radius: 10px;
  background-color: ${(props) => (props.dragActive ? "#f0f0f0" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
`;

const UploadButton = styled.button`
  padding: 6px 16px;
  background: #e9ecef;
  color: #007bff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #007bff;
    color: #fff;
  }
`;

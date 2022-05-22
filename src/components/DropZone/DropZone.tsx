import React from "react";
import Dropzone from "react-dropzone";

import { DropContainer, UploadMessage } from "./styles";

interface IDropZoneProps {
  onUpload: (files: File[]) => void;
}

const renderDragMessage = (isDragActive: boolean, isDragReject: boolean) => {
  if (!isDragActive) {
    return <UploadMessage>Arraste arquivos aqui...</UploadMessage>;
  }

  if (isDragReject) {
    return <UploadMessage type="error">Arquivo não suportado</UploadMessage>;
  }

  return <UploadMessage type="success">Solte os arquivos aqui</UploadMessage>;
};

const DropZone: React.FC<IDropZoneProps> = ({ onUpload }) => {
  return (
    <>
      <Dropzone
        accept={{
          "image/*": [".png", ".jpeg", ".pdf"],
        }}
        onDropAccepted={onUpload}
      >
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
          <DropContainer
            {...getRootProps()}
            isDragActive={isDragActive}
            isDragReject={isDragReject}
          >
            <input {...getInputProps()} />
            {renderDragMessage(isDragActive, isDragReject)}
          </DropContainer>
        )}
      </Dropzone>
    </>
  );
};

export default DropZone;

import React from "react";
import toast from "react-hot-toast";
import { AiOutlineUpload } from "react-icons/ai";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Modal, ModalProps } from "src/components/Modal";
import useConfig from "src/hooks/store/useConfig";
import styled from "styled-components";
import { parseDocument } from "yaml";

const StyledModalContent = styled(Modal.Content)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledUploadWrapper = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  border: 2px dashed ${({ theme }) => theme.BACKGROUND_TERTIARY};
  border-radius: 5px;
  width: 100%;
  min-height: 200px;
  padding: 16px;
  cursor: pointer;

  input[type="file"] {
    display: none;
  }
`;

const StyledFileName = styled.span`
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
`;

const StyledUploadMessage = styled.h3`
  color: ${({ theme }) => theme.INTERACTIVE_ACTIVE};
  margin-bottom: 0;
`;

export const ImportModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const setDocument = useConfig(state => state.setDocument);
  const [url, setURL] = React.useState("");
  const [textFile, setTextFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setTextFile(e.target.files?.item(0));
  };

  const handleImportFile = () => {
    if (url) {
      setTextFile(null);

      toast.loading("Loading...", { id: "toastFetch" });
      return fetch(url)
        .then(res => res.json())
        .then(json => {
          setDocument(JSON.stringify(json));
          setVisible(false);
        })
        .catch(() => toast.error("Failed to fetch JSON!"))
        .finally(() => toast.dismiss("toastFetch"));
    }

    if (textFile) {
      const reader = new FileReader();

      reader.readAsText(textFile, "UTF-8");
      reader.onload = function (data) {
        if (textFile.type === "application/json") {
          setDocument(data.target?.result as string);
        } else if (textFile.type === "application/x-yaml") {
          const convertedYaml = parseDocument(
            data.target?.result as string
          ).toJSON();
          setDocument(JSON.stringify(convertedYaml) as string);
        }
        setVisible(false);
      };
    }
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Import JSON</Modal.Header>
      <StyledModalContent>
        <Input
          value={url}
          onChange={e => setURL(e.target.value)}
          type="url"
          placeholder="URL of JSON to fetch"
        />
        <StyledUploadWrapper>
          <input
            key={textFile?.name}
            onChange={handleFileChange}
            type="file"
            accept="application/JSON, application/x-yaml"
          />
          <AiOutlineUpload size={48} />
          <StyledUploadMessage>Click Here to Upload JSON</StyledUploadMessage>
          <StyledFileName>{textFile?.name ?? "None"}</StyledFileName>
        </StyledUploadWrapper>
      </StyledModalContent>
      <Modal.Controls setVisible={setVisible}>
        <Button
          status="SECONDARY"
          onClick={handleImportFile}
          disabled={!(textFile || url)}
        >
          Import
        </Button>
      </Modal.Controls>
    </Modal>
  );
};

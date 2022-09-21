import React from "react";
import { ErrorContainer } from "src/components/ErrorContainer";
import { MonacoEditor } from "src/components/MonacoEditor";
import styled from "styled-components";
import { LanguageSelect } from "../../../components/LanguageSelect/LanguageSelect";

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  user-select: none;
`;

const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const JsonEditor: React.FC = () => {
  const [hasError, setHasError] = React.useState(false);

  return (
    <StyledEditorWrapper>
      <StyledHeader>
        <ErrorContainer hasError={hasError} />
        <LanguageSelect />
      </StyledHeader>
      <MonacoEditor setHasError={setHasError} />
    </StyledEditorWrapper>
  );
};

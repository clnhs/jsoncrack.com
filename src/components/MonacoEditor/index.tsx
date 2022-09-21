import React from "react";
import Editor, { loader } from "@monaco-editor/react";
import { Loading } from "src/components/Loading";
import useConfig from "src/hooks/store/useConfig";
import useGraph from "src/hooks/store/useGraph";
import useStored from "src/hooks/store/useStored";
import { parser } from "src/utils/jsonParser";
import styled from "styled-components";
import { defaultJson } from "../../constants/data";
import { isValidYaml } from "../../utils/isValidYaml";

loader.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs",
  },
});

const editorOptions = {
  formatOnPaste: true,
  minimap: {
    enabled: false,
  },
};

const StyledWrapper = styled.div`
  display: grid;
  height: calc(100vh - 36px);
  grid-template-columns: 100%;
  grid-template-rows: minmax(0, 1fr);
`;

export const MonacoEditor = ({
  setHasError,
}: {
  setHasError: (value: boolean) => void;
}) => {
  const document = useConfig(state => state.document);
  const language = useConfig(state => state.language);
  const expand = useConfig(state => state.expand);
  const setDocument = useConfig(state => state.setDocument);
  const setGraphValue = useGraph(state => state.setGraphValue);
  const [value, setValue] = React.useState<string | undefined>(document);

  const lightmode = useStored(state => (state.lightmode ? "light" : "vs-dark"));

  React.useEffect(() => {
    const { nodes, edges } = parser(document, expand);

    setGraphValue("nodes", nodes);
    setGraphValue("edges", edges);
  }, [expand, document, setGraphValue]);

  React.useEffect(() => {
    const formatTimer = setTimeout(() => {
      try {
        if (!value) {
          setHasError(false);
          return setDocument("{}");
        }

        if (language === "json") {
          const parsedJSON = JSON.stringify(JSON.parse(value), null, 2);
          setDocument(parsedJSON);
          setHasError(false);
        } else if (language === "yaml") {
          const yaml = isValidYaml(value);
          if (yaml) {
            const parsedJSON = JSON.stringify(yaml.toJSON());
            setDocument(parsedJSON);
            setHasError(false);
          } else throw new Error("invalid YAML");
        }
      } catch (error: any) {
        setHasError(true);
      }
    }, 1200);

    return () => clearTimeout(formatTimer);
  }, [value, language, setDocument, setHasError]);

  return (
    <StyledWrapper>
      <Editor
        height="100%"
        defaultLanguage="json"
        defaultValue={defaultJson}
        value={value}
        theme={lightmode}
        language={language}
        options={editorOptions}
        onChange={setValue}
        onValidate={console.log}
        loading={<Loading message="Loading Editor..." />}
      />
    </StyledWrapper>
  );
};

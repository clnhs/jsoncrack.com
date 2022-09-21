import React from "react";
import styled from "styled-components";
import useConfig from "../../hooks/store/useConfig";

const StyledSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 6px;
`;

const StyledSelect = styled.select`
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  color: ${({ theme }) => theme.TEXT_NORMAL};
  border-radius: 4px;
  height: 25px;
  outline: none;
  border: none;
  width: 112px;
  font-size: 14px;
  font-weight: 500;
`;

export const LanguageSelect = () => {
  const setLanguage = useConfig(state => state.setLanguage);
  const getLanguage = useConfig(state => state.getLanguage);

  const defaultLanguage = getLanguage();

  const languageChangeHandler = e => {
    setLanguage(e.target.value);
  };

  return (
    <StyledSelectWrapper>
      <StyledSelect
        name="Language"
        id="language-select"
        defaultValue={defaultLanguage}
        onChange={languageChangeHandler}
      >
        <option value="json">JSON</option>
        <option value="yaml">YAML</option>
      </StyledSelect>
    </StyledSelectWrapper>
  );
};

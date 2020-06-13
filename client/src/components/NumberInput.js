import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";

const StyledNumberInput = styled.input`
  margin: 0;

  box-sizing: border-box;
  padding: 8px 12px;
  background: white;
  border: ${({ theme }) =>
    `${theme.sizes.border.m} solid ${theme.colors.darkest}`};
  border-radius: ${({ theme }) => theme.sizes.borderRadius.m};
  font-size: ${({ block }) => (block ? "0.9rem" : "0.8rem")};
  text-transform: uppercase;
  letter-spacing: 0.09em;
  font-weight: 700;
  outline: 0;
  &:focus {
    border: ${({ theme }) =>
      `${theme.sizes.border.m} solid ${theme.colors.primary}`};
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  margin-bottom: ${({ theme }) => theme.space.l}px;

  &:after {
    content: "Ξ";
    display: inline-flex;
    align-items: center;
    position: absolute;
    right: 12px;
    font-size: 0.9em;
    top: 0;
    bottom: 0;
    color: #aaaaaa;
  }
`;

export const NumberInput = ({ value, onChange }) => {
  const [internalValue, setInternalValue] = useState(value);
  const handleChange = useCallback(
    (event) => {
      const number = Number(internalValue);
      if (!Number.isNaN(number)) {
        onChange(Number(internalValue));
        setInternalValue(number.toString());
      } else {
        setInternalValue(value);
      }
    },
    [onChange, internalValue],
  );

  const handleInternalChange = useCallback((event) => {
    setInternalValue(event.currentTarget.value);
  }, []);

  return (
    <Wrapper>
      <StyledNumberInput
        value={internalValue}
        onBlur={handleChange}
        onChange={handleInternalChange}
      />
    </Wrapper>
  );
};

import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { IButton } from '@ui-lib/types';
import { colors } from '@ui-lib/utils';
import clsx from 'clsx';

const StyledButton = styled.button`
  padding: 8px 20px;
  border-radius: 6px;
  background: ${colors.orange};
  color: ${colors.white};

  &.disabled {
    opacity: 0.5;
    background: ${colors.gray};
    pointer-events: none;
    color: ${colors.black};
  }
`;

const Button: React.FC<IButton> = ({
  children,
  disabled,
  className = '',
  onClick,
}) => {
  const handleClick = () => {
    onClick?.();
  };
  return (
    <StyledButton
      onClick={handleClick}
      className={clsx(className, { disabled: disabled })}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

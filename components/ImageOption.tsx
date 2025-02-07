import React from 'react';
import styled from 'styled-components';

interface ImageOptionProps {
  url: string;
  onClick: () => void;
  isSelected?: boolean;
}

const ImageContainer = styled.div<{ isSelected?: boolean }>`
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.isSelected ? '#0065eb' : 'transparent'};
  transition: border-color 0.2s;

  &:hover {
    border-color: #0065eb;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ImageOption: React.FC<ImageOptionProps> = ({ url, onClick, isSelected }) => (
  <ImageContainer onClick={onClick} isSelected={isSelected}>
    <Image src={url} alt="Template option" />
  </ImageContainer>
);

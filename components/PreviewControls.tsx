import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Preview } from '@creatomate/preview';

const ControlsContainer = styled.div`
  padding: 10px;
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background: #0065eb;
  color: white;
  cursor: pointer;

  &:hover {
    background: #0052bd;
  }
`;

interface PreviewControlsProps {
  preview: Preview;
}

export const PreviewControls: React.FC<PreviewControlsProps> = ({ preview }) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    preview.onTimeChange = (time) => setCurrentTime(time);
  }, [preview]);

  return (
    <ControlsContainer>
      <Button onClick={() => preview.play()}>
        Play
      </Button>
      <Button onClick={() => preview.pause()}>
        Pause
      </Button>
      <Button onClick={() => preview.setTime(0)}>
        Restart
      </Button>
      <span>Tempo: {currentTime.toFixed(1)}s</span>
    </ControlsContainer>
  );
}; 
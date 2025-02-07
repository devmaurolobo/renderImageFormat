import React, { useState } from 'react';
import styled from 'styled-components';
import { Preview } from '@creatomate/preview';
import { Button } from './Button';

interface CreateButtonProps {
  preview: Preview;
  children?: React.ReactNode;
}

export const CreateButton: React.FC<CreateButtonProps> = ({ preview, children }) => {
  const [isRendering, setIsRendering] = useState(false);
  const [render, setRender] = useState<any>();

  if (isRendering) {
    return <Component style={{ background: '#e67e22' }}>Rendering...</Component>;
  }

  if (render) {
    return (
      <Component
        style={{ background: '#2ecc71' }}
        onClick={() => {
          window.open(render.url, '_blank');
          setRender(undefined);
        }}
      >
        Download
      </Component>
    );
  }

  return (
    <Component
      style={{ display: 'block', marginLeft: 'auto' }}
      onClick={async () => {
        setIsRendering(true);

        try {
          const render = await finishVideo(preview);
          if (render.status === 'succeeded') {
            setRender(render);
          } else {
            window.alert(`Rendering failed: ${render.errorMessage}`);
          }
        } catch (error) {
          window.alert(error);
        } finally {
          setIsRendering(false);
        }
      }}
    >
      {children || 'Create Video'}
    </Component>
  );
};

const Component = styled(Button)`
  display: block;
  margin-left: auto;
`;

const finishVideo = async (preview: Preview) => {
  const source = preview.getSource();
  const modifications = (preview.state as any)?.modifications || {};

  const response = await fetch('/api/videos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template_id: source.id,
      modifications,
      output_format: 'mp4',
      width: source.width || 1920,
      height: source.height || 1080,
      fps: 30,
      quality: 'high'
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('No API key was provided. Please refer to the README.md for instructions.');
    } else {
      throw new Error(`The request failed with status code ${response.status}`);
    }
  }

  return await response.json();
};

export const StyledCreateButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  background: #0065eb;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0052bd;
  }

  &:active {
    background: #00429d;
  }
`;

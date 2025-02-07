import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Preview } from '@creatomate/preview';
import { SharedSettingsPanel } from './SharedSettingsPanel';

const Container = styled.div`
  display: flex;
  gap: 40px;
  padding: 20px;
  max-width: 1800px;
  margin: 0 auto;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
`;

const PreviewsContainer = styled.div`
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const SidePanel = styled.div`
  width: 400px;
  flex-shrink: 0;
  align-self: flex-start;
  position: sticky;
  top: 20px;
`;

const PreviewContainer = styled.div<{ isStory?: boolean }>`
  flex: 0 1 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PreviewContent = styled.div<{ isStory?: boolean }>`
  width: ${props => props.isStory ? '360px' : '600px'};
  height: ${props => props.isStory ? '640px' : '600px'};
`;

const PreviewTitle = styled.h2`
  text-align: center;
  margin: 10px 0;
  font-size: 18px;
  color: #333;
`;

export function MultiplePreview() {
  const preview1Ref = useRef<HTMLDivElement>(null);
  const preview2Ref = useRef<HTMLDivElement>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);

  useEffect(() => {
    if (!preview1Ref.current || !preview2Ref.current) return;

    const token = process.env.NEXT_PUBLIC_CREATOMATE_PUBLIC_TOKEN;
    const templateId1 = process.env.NEXT_PUBLIC_TEMPLATE_ID_1;
    const templateId2 = process.env.NEXT_PUBLIC_TEMPLATE_ID_2;

    console.log('Token:', token);
    console.log('Template ID 1:', templateId1);
    console.log('Template ID 2:', templateId2);

    const preview1 = new Preview(
      preview1Ref.current,
      'player',
      token as string
    );

    const preview2 = new Preview(
      preview2Ref.current,
      'player',
      token as string
    );

    preview1.onReady = async () => {
      console.log('Preview 1 ready');
      try {
        console.log('Tentando carregar template 1:', templateId1);
        await preview1.loadTemplate(templateId1 as string);
        console.log('Template 1 carregado com sucesso');
      } catch (error) {
        console.error('Erro ao carregar template 1:', error);
      }
    };

    preview2.onReady = async () => {
      console.log('Preview 2 ready');
      try {
        console.log('Tentando carregar template 2:', templateId2);
        await preview2.loadTemplate(templateId2 as string);
        console.log('Template 2 carregado com sucesso');
      } catch (error) {
        console.error('Erro ao carregar template 2:', error);
      }
    };

    setPreviews([preview1, preview2]);

    return () => {
      preview1.dispose();
      preview2.dispose();
    };
  }, []);

  // Função para aplicar modificações em ambos os previews
  const applyModifications = (modifications: Record<string, any>) => {
    previews.forEach(preview => {
      preview.setModifications(modifications);
    });
  };

  return (
    <Container>
      <MainContent>
        <PreviewsContainer>
          <PreviewContainer isStory>
            <PreviewTitle>Template 9x16</PreviewTitle>
            <PreviewContent ref={preview1Ref} isStory />
          </PreviewContainer>
          
          <PreviewContainer>
            <PreviewTitle>Template 1x1</PreviewTitle>
            <PreviewContent ref={preview2Ref} />
          </PreviewContainer>
        </PreviewsContainer>
      </MainContent>
      
      <SidePanel>
        {previews.length > 0 && (
          <SharedSettingsPanel previews={previews} />
        )}
      </SidePanel>
    </Container>
  );
} 
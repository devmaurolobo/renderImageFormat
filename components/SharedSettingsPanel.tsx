import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Preview, PreviewState } from '@creatomate/preview';
import { TextInput } from './TextInput';
import { ImageOption } from './ImageOption';
import { Button } from './Button';
import { CreateButton } from './CreateButton';
import { TestButton } from './TestButton';
import Image from 'next/image';

interface SharedSettingsPanelProps {
  previews: Preview[];
}

const colorPalette = [
  '#FF5733', '#33FF57', '#3357FF', '#F39C12', '#8E44AD', '#E74C3C', '#1ABC9C'
];

const imageOptions = [
  'https://creatomate-static.s3.amazonaws.com/demo/harshil-gudka-77zGnfU_SFU-unsplash.jpg',
  'https://creatomate-static.s3.amazonaws.com/demo/samuel-ferrara-1527pjeb6jg-unsplash.jpg',
  'https://creatomate-static.s3.amazonaws.com/demo/simon-berger-UqCnDyc_3vA-unsplash.jpg'
];

export const SharedSettingsPanel: React.FC<SharedSettingsPanelProps> = ({ previews }) => {
  const modificationsRef = useRef<Record<string, any>>({});
  const [selectedImages, setSelectedImages] = useState<Record<number, string>>({});

  const findElement = (elementName: string) => {
    // Procura o elemento em qualquer um dos previews
    for (const preview of previews) {
      const element = preview.getElements().find((element) => element.source.name === elementName);
      if (element) return element;
    }
    return undefined;
  };

  const setPropertyValue = async (
    selector: string,
    value: string,
    modifications: Record<string, any>,
  ) => {
    if (value.trim()) {
      modifications[selector] = value;
    } else {
      delete modifications[selector];
    }
    console.log('💡 Modificações atualizadas:', modificationsRef.current);
    await Promise.all(
      previews.map(preview => preview.setModifications(modifications))
    );
  };

  const ensureElementVisibility = async (elementName: string, addTime: number) => {
    await Promise.all(previews.map(async (preview) => {
      const element = preview.getElements().find((element) => element.source.name === elementName);
      if (element) {
        await preview.setTime(element.globalTime + addTime);
      }
    }));
  };

  const handleCreateVideo = async (previews: Preview[]) => {
    try {
      console.log('1. Iniciando criação dos vídeos');
      console.log('📝 Estado atual das modificações:', modificationsRef.current);
      
      const renderPromises = previews.map(async (preview, index) => {
        console.log(`2. Preparando preview ${index + 1}`);
        
        const source = preview.getSource();
        console.log(`3. Source do preview ${index + 1}:`, source);
        
        const modifications = modificationsRef.current;
        console.log(`🎯 Preview ${index + 1} - Modificações:`, modifications);
        console.log(`🔍 Preview ${index + 1} - Modificações detalhadas:`, {
          textos: Object.keys(modifications).filter(key => !key.includes('.')),
          cores: Object.keys(modifications).filter(key => key.includes('fill_color')),
          imagens: Object.keys(modifications).filter(key => key.includes('Image')),
        });

        const renderConfig = {
          template_id: source.id,
          modifications,
          output_format: 'mp4',
          width: source.width || 1920,
          height: source.height || 1080,
          fps: 30,
          quality: 'high'
        };

        console.log(`5. Configuração de renderização ${index + 1}:`, renderConfig);

        const response = await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(renderConfig),
        });

        console.log(`6. Status da resposta ${index + 1}:`, response.status);

        if (!response.ok) {
          throw new Error(`Erro na renderização ${index + 1}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`7. Resultado da renderização ${index + 1}:`, result);

        return result;
      });

      console.log('8. Aguardando todas as renderizações');
      const results = await Promise.all(renderPromises);
      console.log('9. Todos os resultados:', results);

      return results;
    } catch (error) {
      console.error('❌ Erro no processo:', error);
      throw error;
    }
  };

  return (
    <PanelContainer>
      {/* Grupo de Textos */}
      <Group>
        <GroupTitle>Textos</GroupTitle>
        {['Title', 'Subtitle', 'Description', 'Value', 'Footer'].map((textName) => (
          <TextInput
            key={textName}
            placeholder={textName}
            onChange={(e) =>
              setPropertyValue(textName, e.target.value, modificationsRef.current)
            }
          />
        ))}
      </Group>

      <Group>
        <GroupTitle>Imagens</GroupTitle>
        <ImageOptions>
          {[
            'https://creatomate-static.s3.amazonaws.com/demo/harshil-gudka-77zGnfU_SFU-unsplash.jpg',
            'https://creatomate-static.s3.amazonaws.com/demo/samuel-ferrara-1527pjeb6jg-unsplash.jpg',
            'https://creatomate-static.s3.amazonaws.com/demo/simon-berger-UqCnDyc_3vA-unsplash.jpg'
          ].map((url) => (
            <ImagePreview key={url} onClick={() => {
              const imageElement = findElement('Image1');
              if (imageElement) {
                ensureElementVisibility(imageElement.source.name, 1.5);
                setPropertyValue(
                  imageElement.source.name,
                  url,
                  modificationsRef.current
                );
              }
            }}>
              <img src={url} alt="Template option" />
            </ImagePreview>
          ))}
        </ImageOptions>
      </Group>

      {/* Grupo de Cores */}
      <Group>
        <GroupTitle>Cores</GroupTitle>
        {[1, 2, 3].map((index) => (
          <div key={index}>
            <SubGroupTitle>Shape {index}</SubGroupTitle>
            <ColorOptions>
              {colorPalette.map((color) => (
                <ColorBox
                  key={color}
                  color={color}
                  onClick={() => {
                    setPropertyValue(
                      `Shape${index}.fill_color`,
                      color,
                      modificationsRef.current
                    );
                  }}
                />
              ))}
            </ColorOptions>
          </div>
        ))}
      </Group>

      {/* Botões de ação */}
      <Group>
        <GroupTitle>Ações</GroupTitle>
        <ButtonsContainer>
          <CreateButton preview={previews[0]}>
            Criar Mídias
          </CreateButton>
          <TestButton />
        </ButtonsContainer>
      </Group>
    </PanelContainer>
  );
};

// Estilos (mantidos do SettingsPanel original)
const PanelContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Group = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: #f5f7f8;
  border-radius: 5px;
`;

const GroupTitle = styled.div`
  margin-bottom: 15px;
  font-weight: 600;
`;

const SubGroupTitle = styled.div`
  margin: 10px 0 5px 0;
  font-weight: 500;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ColorBox = styled.div<{ color: string }>`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background-color: ${(props) => props.color};
  cursor: pointer;
  border: 2px solid #ccc;
  &:hover {
    border-color: #000;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const ImageOptions = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;
`;

const ImagePreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    border-color: #0065eb;
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  
  > button {
    margin-bottom: 10px;
  }
`; 
import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  width: 100%;
  padding: 12px 24px;
  background: #0065eb;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #0052bd;
  }
`;

export const TestButton = () => {
  const handleTest = async () => {
    try {
      const testConfig = {
        template_id: "245ebbe4-e05c-475a-9cdb-219d1e273a79",
        modifications: {
          "Title": "Teste API",
          "Description": "Testando a conexão com Creatomate"
        },
        output_format: 'png'
      };

      const response = await fetch('https://api.creatomate.com/v1/renders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 091b81aff6af4403a2bcfa2e6410f585dc861dd5650d40286610acc018fca4518b17cb7db67261cc0c4302991c20d4b4'
        },
        body: JSON.stringify(testConfig)
      });
      
      const data = await response.json();
      console.log('Resultado do teste:', data);
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro no teste:', error);
    }
  };

  return (
    <Button onClick={handleTest}>
      Render Creatomate
    </Button>
  );
}; 
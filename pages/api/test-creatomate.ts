import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔑 API Key:', process.env.CREATOMATE_API_KEY);

    // Teste simples de renderização
    const testConfig = {
      template_id: "245ebbe4-e05c-475a-9cdb-219d1e273a79",
      modifications: {
        "Title": "Teste API",
        "Description": "Testando a conexão com Creatomate"
      },
      output_format: 'png',
    };

    console.log('Configuração de teste:', testConfig);

    const response = await fetch('https://api.creatomate.com/v1/renders', {
      method: 'POST',
      headers: {

        'Authorization': `Bearer 091b81aff6af4403a2bcfa2e6410f585dc861dd5650d40286610acc018fca4518b17cb7db67261cc0c4302991c20d4b4`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testConfig)
    });

    console.log('📡 Status da resposta:', response.status);
    console.log('Configuração de teste:', testConfig);
    
    const data = await response.json();
    console.log('📄 Resposta completa:', data);

    if (!response.ok) {
      throw new Error(`Erro na API Creatomate: ${data.message || response.statusText}`);
    }

    res.status(200).json({
      success: true,
      data,
      config: testConfig
    });
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    res.status(500).json({ 
      success: false,
      message: 'Falha no teste da API', 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
} 
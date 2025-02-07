import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('1. Iniciando processo de renderização');
    const { source, modifications } = req.body;
    
    console.log('2. Dados recebidos:', { source, modifications });

    // Configuração do vídeo
    const renderConfig = {
      template_id: req.body.template_id,
      modifications: req.body.modifications,
      output_format: req.body.output_format,
      width: req.body.width,
      height: req.body.height,
      fps: req.body.fps,
      quality: req.body.quality
    };

    console.log('3. Configuração de renderização:', renderConfig);

    const response = await fetch('https://api.creatomate.com/v1/renders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(renderConfig),
    });

    console.log('4. Status da resposta:', response.status);

    if (!response.ok) {
      throw new Error(`Creatomate API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('5. Resposta da Creatomate:', data);
    
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Erro na renderização:', error);
    res.status(500).json({ 
      message: 'Failed to render video', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    },
    body: JSON.stringify({
      message: 'Udyam Registration API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
      endpoints: {
        registrations: '/api/registrations',
        documents: '/api/documents',
        health: '/api/health'
      }
    }),
  };
};

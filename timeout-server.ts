import * as http from 'http';

const server = http.createServer(async (req: any, res: any) => {
  console.log('Received request');

  const bodyCompletePromise = new Promise<void>((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve();
      const jsonBody = JSON.parse(body);
      console.log('Span count:', jsonBody.resourceSpans.length);
    });
  });
  await bodyCompletePromise;
  
  console.log('Destroying request');
  req.destroy();
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

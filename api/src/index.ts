import { serve } from '@hono/node-server'
import app from '@/app'

const port = Number(process.env.PORT) || 3000

serve({ ...app, port }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
// import path from 'path';
import cors from 'cors';
import { authenticateToken } from './services/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';

// import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const startApolloServer = async () => {
  await server.start();

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', // Allow requests from the React frontend
    credentials: true, // Include credentials like cookies or headers
  };

  app.use(cors(corsOptions)); // Apply CORS middleware
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ));

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../client/dist'));

    app.get('*', (_req, res) => {
    res.sendFile('../client/dist/index.html');
  });
}
  
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
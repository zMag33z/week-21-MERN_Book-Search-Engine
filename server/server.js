const express = require('express');
// const path = require('path');
// const db = require('./config/connection');
// const routes = require('./routes');

// import apollo which includes our graphql visual interface
const { ApolloServer } = require('apollo-server-express');
//we require an auth function to pass below as context
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// server will be an apolloServer and each call will be a new instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

console.log('LOGGGGGGG', server.context)

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call the async function to call the apollo server
startApolloServer(typeDefs, resolvers);
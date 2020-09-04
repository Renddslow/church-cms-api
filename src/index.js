require('dotenv').config();
const polka = require('polka');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GraphQLClient } = require('graphql-request');

/** Mediators */
const mediator = require('./utils/mediator');
require('./utils/getUsers')();
require('./utils/sendEmail')();
require('./utils/getContent')();

/** Controllers */
const auth = require('./controllers/auth');
const createToken = require('./controllers/token');
const getFile = require('./controllers/getFile');
const listFiles = require('./controllers/listFiles');
const listPages = require('./controllers/listPages');
const me = require('./controllers/me');

const PORT = process.env.PORT || 8080;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const resJson = (req, res, next) => {
  res.json = (body, statusCode = 200) => {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = statusCode;
    res.end(JSON.stringify(body));
  };

  next();
};

const gqlClient = new GraphQLClient(`https://api.github.com/graphql`, {
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

mediator.provide('graphql', (query, variables) => {
  return gqlClient.request(query, variables || {});
});

polka()
  .use(cors(), bodyParser.json(), resJson)
  .post('/token', createToken(mediator))
  .get('/me', auth(mediator), me())
  .get('/lists/pages', auth(mediator), listPages(mediator))
  .get('/lists/:contentType', auth(mediator), listFiles(mediator))
  .get('/files/:parent?/:permalink', auth(mediator), getFile(mediator))
  .listen(PORT, () => console.log(`💒 Running Church CMS on port ${PORT}`));

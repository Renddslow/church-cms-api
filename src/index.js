require('dotenv').config();
const polka = require('polka');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { GraphQLClient, gql } = require('graphql-request');
const fm = require('front-matter');
const { get } = require('dot-prop');

const mediator = require('./utils/mediator');

const PORT = process.env.PORT || 8080;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const resJson = (req, res, next) => {
  res.json = (body) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
  };

  next();
};

const auth = () => {
  // check token
};

const gqlClient = new GraphQLClient(`https://api.github.com/graphql`, {
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

const getContent = (e) => {
  const { attributes, body } = fm(e);
  return { ...attributes, body };
};

mediator.provide('graphql', (query, variables) => {
  return gqlClient.request(query, variables || {});
});

polka()
  .use(cors(), bodyParser.json(), resJson)
  .post('/token', (req, res) => {
    // check users
    // if there, send email
    // otherwise, send 200
  })
  .get('/me', (req, res) => {
    // read from users, get self
  })
  .get('/lists/:contentType', async (req, res) => {
    const expression = `master:content/${req.params.contentType}`;

    const query = gql`
        query List {
            repository(name:"flatland-site-hugo", owner:"flatlandchurch") {
                object(expression:"${expression}") {
                    ...on Tree {
                        entries {
                            name
                            object {
                                ...on Blob {
                                    text
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    const data = await mediator.call('graphql', query);
    const { entries } = get(data, 'repository.object', []);

    res.json(
      entries.map((entry) => ({
        permalink: get(entry, 'name', ''),
        ...getContent(get(entry, 'object.text', '')),
      })),
    );
  })
  .get('/files/:parent?/:permalink', async (req, res) => {
    const fullPermalink = req.params.parent
      ? `${req.params.parent}/${req.params.permalink}`
      : req.params.permalink;
    const permalink = fullPermalink.includes('.md') ? fullPermalink : `${fullPermalink}.md`;
    const expression = `master:content/${permalink}`;
    const query = gql`
        query List {
            repository(name:"flatland-site-hugo", owner:"flatlandchurch") {
                object(expression:"${expression}") {
                    ...on Blob {
                        text
                    }
                }
            }
        }
    `;
    const data = await mediator.call('graphql', query);
    res.json(getContent(get(data, 'repository.object.text', '')));
  })
  .listen(PORT, () => console.log(`💒 Running Church CMS on port ${PORT}`));

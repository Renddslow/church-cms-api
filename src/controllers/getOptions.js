const { get } = require('dot-prop');
const { gql } = require('graphql-request');

module.exports = (mediator) => async (req, res) => {
  const fullPermalink = req.params.child
    ? `${req.params.permalink}/${req.params.child}`
    : req.params.permalink;

  const expression = fullPermalink.includes('data') ? fullPermalink : `content/${fullPermalink}`;

  const query = gql`
    query List {
      repository(name: "flatland-site-hugo", owner: "flatlandchurch") {
        object(expression: "master:${expression}") {
          ... on Tree {
            entries {
              name
              object {
                ... on Blob {
                  text
                }
              }
            }
          }
          ... on Blob {
              text
          }
        }
      }
    }
  `;

  const data = await mediator.call('graphql', query);
  const { entries, text } = get(data, 'repository.object', []);

  if (text) {
    return res.json(JSON.parse(text));
  }

  res.json(
    entries
      .map((entry) => ({
        permalink: get(entry, 'name', ''),
        ...mediator.call('getContent', get(entry, 'object.text', '')),
      }))
      .filter(({ permalink }) => permalink !== '_index.md'),
  );
};

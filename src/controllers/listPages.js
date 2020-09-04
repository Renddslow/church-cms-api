const { get } = require('dot-prop');
const { gql } = require('graphql-request');

module.exports = (mediator) => async (req, res) => {
  const query = gql`
    query List {
      repository(name: "flatland-site-hugo", owner: "flatlandchurch") {
        object(expression: "master:content") {
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
        }
      }
    }
  `;

  const data = await mediator.call('graphql', query);
  const { entries } = get(data, 'repository.object', []);

  res.json(
    entries
      .map((entry) => ({
        permalink: get(entry, 'name', ''),
        ...mediator.call('getContent', get(entry, 'object.text', '')),
      }))
      .filter(({ permalink }) => permalink.includes('.md')),
  );
};

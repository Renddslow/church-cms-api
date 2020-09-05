const { get } = require('dot-prop');
const { gql } = require('graphql-request');
const sort = require('sort-on');

const MULTIPLIER = 24;

module.exports = (mediator) => async (req, res) => {
  const { page = 1 } = req.query;

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

  const offset = (page - 1) * MULTIPLIER;
  const limit = offset + MULTIPLIER;

  const pages = sort(
    entries
      .map((entry) => ({
        permalink: get(entry, 'name', ''),
        ...mediator.call('getContent', get(entry, 'object.text', '')),
      }))
      .filter(({ permalink }) => permalink.includes('.md')),
    'title',
  );

  res.json({
    pages: pages.slice(offset, limit),
    pageCount: Math.ceil(pages.length / MULTIPLIER),
  });
};

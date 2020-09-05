const { get } = require('dot-prop');
const { gql } = require('graphql-request');

module.exports = (mediator) => async (req, res) => {
  const fullPermalink = req.params.child
    ? `${req.params.permalink}/${req.params.child}`
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
  res.json(mediator.call('getContent', get(data, 'repository.object.text', '')));
};

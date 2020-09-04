const { gql } = require('graphql-request');
const { get } = require('dot-prop');
const yaml = require('yaml');

const mediator = require('../utils/mediator');

const getUsers = () =>
  mediator.provide('getUsers', async () => {
    const query = gql`
      query Users {
        repository(name: "church-cms-meta", owner: "Renddslow") {
          object(expression: "master:users.yml") {
            ... on Blob {
              text
            }
          }
        }
      }
    `;
    const data = get(await mediator.call('graphql', query), 'repository.object.text', '');
    return yaml.parse(data) || [];
  });

module.exports = getUsers;

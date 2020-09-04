const fm = require('front-matter');

const mediator = require('./mediator');

const getContent = () =>
  mediator.provide('getContent', (e) => {
    const { attributes, body } = fm(e);
    return { ...attributes, body };
  });

module.exports = getContent;

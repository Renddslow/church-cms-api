const { has, get } = require('dot-prop');
const jwt = require('jsonwebtoken');

const template = require('../templates/token');

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (mediator) => async (req, res) => {
  const { data } = req.body;

  if (!has(data, 'attributes.email') && get(data, 'type') !== 'token') {
    return res.json(
      {
        errors: [
          {
            message: 'Missing required', // TODO: make real error objects
          },
        ],
      },
      400,
    );
  }

  const users = await mediator.call('getUsers');
  const currentUser = users.find(({ email }) => get(data, 'attributes.email') === email);

  if (!currentUser) {
    return res.json(
      {
        errors: [
          {
            message: 'Invalid user', // TODO: make real error objects
          },
        ],
      },
      400,
    );
  }

  const token = await jwt.sign(data, JWT_SECRET);
  const response = await mediator.call(
    'sendEmail',
    '[Flatland Admin] Magic Link ✨',
    template(token),
    data.attributes.email,
    {
      name: 'Flatland Church',
      email: 'no-reply@flatland.church',
    },
  );
  console.log(response);

  res.json({
    data: {
      type: 'token',
      meta: {
        message: 'Magic link sent',
      },
    },
  });
};

module.exports = createToken;

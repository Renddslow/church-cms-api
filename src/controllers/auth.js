const catchify = require('catchify');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (mediator) => async (req, res, next) => {
  const [, token] = req.headers.authorization.split(' ');
  const [err, payload] = await catchify(jwt.verify(token, JWT_SECRET));

  if (err) {
    return res.json(
      {
        errors: [],
      },
      401,
    );
  }

  const users = await mediator.call('getUsers');
  const currentUser = users.find(({ email }) => email === payload.attributes.email);

  if (!currentUser) {
    return res.json(
      {
        errors: [],
      },
      401,
    );
  }

  req.user = currentUser;

  return next();
};

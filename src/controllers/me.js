module.exports = () => (req, res) =>
  res.json({
    data: {
      id: req.user.email,
      type: 'user',
      attributes: req.user,
    },
  });

const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  const [tokenType, tokenValue] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    res.status(401).send({
      msg: '로그인 후 사용하세요',
    });
    return;
  }

  try {
    const { userId } = jwt.verify(tokenValue, 'my-secret-key');

    User.findOne({ userId }).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    console.log('요기')
    res.status(401).send({
      msg: '로그인 후 사용하세요',
    });
    return;
  }
};

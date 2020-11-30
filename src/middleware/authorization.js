import jwt from 'jsonwebtoken';

export const authorization = (req, res, next) => {
  try {
    const bearer = req.header('authorization').split(' ');
    const [, bearerToken] = bearer;

    const dataJwt = jwt.verify(bearerToken, process.env.SECRET_KEY);

    if (!dataJwt) {
      res.status(401).send({ message: 'Invalid token' });
      return;
    }

    req.jwtData = dataJwt;

    return next();
  } catch (error) {
    res.status(401).send({ message: 'Invalid token' });
    return;
  }
};

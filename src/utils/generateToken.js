import jwt from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';
//import _ from 'lodash';

export const createToken = (payload, secretKey, expiresIn) =>
  jwt.sign(payload, secretKey, {
    expiresIn,
    audience: process.env.AUDIENCE,
    issuer: process.env.ISSUER,
  });

export const createRefreshToken = () => cryptoRandomString({ length: 40 });

export const createTokens = (payload) => {
  const token = createToken(
    payload,
    process.env.SECRET_KEY,
    Number(process.env.ACCESS_TOKEN_EXPIRES)
  );
  const refreshToken = createRefreshToken();

  return [token, refreshToken];
};

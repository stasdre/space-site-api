import db from '../models';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { createTokens } from '../utils/generateToken';
import { setTokenCookie } from '../utils/setTokenCookie';

const User = db.users;
const Token = db.token;

const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  let userData = await User.findOne({
    where: {
      email,
    },
  });
  if (userData) {
    res.status(400).send({ message: 'Failed!' });
    return;
  }

  // create new user
  try {
    userData = await User.create({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 11),
    });

    res.status(200).send({ message: 'Success', data: { firstName, lastName, email } });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await User.findOne({
      where: {
        email,
      },
    });

    if (!userData || !bcrypt.compareSync(password, userData.password)) {
      res.status(400).send({ message: 'Failed email or password!' });
      return;
    }

    const [accessToken, refreshToken] = createTokens({
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    await Token.create({
      UserId: userData.id,
      refreshToken,
      ua: req.headers['user-agent'],
      ip: req.ip,
      expires: new Date(Date.now() + process.env.REFRESH_TOKEN_EXPIRES * 1000),
    });

    setTokenCookie(res, refreshToken);

    res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies.__rt;

    if (!token) {
      res.status(401).send({ message: 'Invalid token' });
      return;
    }

    const ua = req.headers['user-agent'];
    const ip = req.ip;

    const oldTokenData = await Token.findOne({
      where: {
        refreshToken: token,
        ua,
        ip,
        expires: {
          [Op.gte]: Date.now(),
        },
      },
    });

    if (!oldTokenData) {
      res.status(401).send({ message: 'Invalid token' });
      return;
    }

    const userData = await oldTokenData.getUser();

    if (!userData) {
      res.status(401).send({ message: 'Invalid token' });
      return;
    }

    const [accessToken, refreshToken] = createTokens({
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    await oldTokenData.destroy();

    await Token.create({
      UserId: userData.id,
      refreshToken,
      ua: req.headers['user-agent'],
      ip: req.ip,
      expires: new Date(Date.now() + process.env.REFRESH_TOKEN_EXPIRES * 1000),
    });

    setTokenCookie(res, refreshToken);

    res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!!!' });
  }
};

export { signup, signin, refresh };

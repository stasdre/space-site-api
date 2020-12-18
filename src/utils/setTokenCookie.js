export const setTokenCookie = (res, token) => {
  const cookieOptions = {
    domain: process.env.AUDIENCE,
    expires: new Date(Date.now() + process.env.REFRESH_TOKEN_EXPIRES * 1000),
    httpOnly: true,
    //secure: process.env.NODE_ENV === 'production',
  };
  res.cookie('__rt', token, cookieOptions);
};

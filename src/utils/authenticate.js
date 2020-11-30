// Instruments
import { NotFoundError } from './errors';

export const authenticate = (req, res, next) => {
    if (!req.session.user) {
        return next(new NotFoundError('cookie not found', 401));
    }

    const { hash } = req.session.user;

    if (hash) {
        next();
    } else {
        res.status(401).json({ message: 'authentication credentials are not valid' });
    }
};

import jwt from 'jsonwebtoken';

export function generateJWTAccessToken(payload)  {
    let options = {
        expiresIn: 10000,
    };

    return jwt.sign(payload, "JWT_TOKEN_SECRET", options);
};

export function verifyJwtAccessToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, "JWT_TOKEN_SECRET", (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}
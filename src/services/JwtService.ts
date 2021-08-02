import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config';

class JwtService {
  static sign(payload: any, expiry='6h', secret: string=SECRET_KEY || '') {
    return jwt.sign(payload, secret, { expiresIn: expiry })
  }
  static verify(token: string, secret=SECRET_KEY || '') {
    return jwt.verify(token, secret)
  }
}

export default JwtService
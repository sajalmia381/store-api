import jwt from 'jsonwebtoken';
import { REFRESH_KEY, SECRET_KEY } from '../config';

class JwtService {
  static sign(payload: any, expiry: string | number='6h', secret: string=SECRET_KEY || '') {
    return jwt.sign({data: payload}, secret, { expiresIn: expiry })
  }
  static verify(token: string, secret=SECRET_KEY || '') {
    return jwt.verify(token, secret)
  }
  
  static generateJWTTokens(payload: any, tokenValidity?: string, RefreshTokenValidity?: number): [string, string] {
    let access_token = JwtService.sign(payload, '15m');
    let refresh_token = JwtService.sign(payload, '1d', REFRESH_KEY);
    if (tokenValidity) {
      switch(tokenValidity) {
        case 'long': {
          access_token = JwtService.sign(payload, '1d')
          refresh_token = JwtService.sign(payload, '30d', REFRESH_KEY)
          break
        }
        case 'short': {
          access_token = JwtService.sign(payload, '1m')
          refresh_token = JwtService.sign(payload, '2m', REFRESH_KEY)
          break
        }
        default: {
          // token Validation value as minutes
          access_token = JwtService.sign(payload, 60 * parseInt(tokenValidity))
          refresh_token = JwtService.sign(payload, 60 * (RefreshTokenValidity || (parseInt(tokenValidity) + 5)), REFRESH_KEY)
        }
      }
    }
    return [access_token, refresh_token]
  }
}

export default JwtService;
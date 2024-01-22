import { REFRESH_KEY } from '../src/config';
import JwtService from '../src/services/JwtService';

class Utils {
  static superAdminUserPayload = {
    name: 'User Admin',
    email: 'useradmin@gmail.com',
    role: 'ROLE_SUPER_ADMIN'
  };

  static access_token = JwtService.sign(this.superAdminUserPayload);
  static refresh_token = JwtService.sign(this.superAdminUserPayload, '6h', REFRESH_KEY);
}

export default Utils;

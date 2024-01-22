import JwtService from "../services/JwtService";


class Utils {
  static superAdminUserPayload = {
    name: 'User Admin',
    email: 'useradmin@gmail.com',
    role: 'ROLE_SUPER_ADMIN'
  }
  
  static token = JwtService.sign(this.superAdminUserPayload)
}

export default Utils
class CustomErrorHandler extends Error {
  status: number;
  constructor(status: number, msg: string) {
    super();
    this.status = status;
    this.message = msg;
  }
  static alreadyExists(message: string) {
    return new CustomErrorHandler(409, message)
  }
  static invalidCredentials(message: string='User or Password is Wrong.') {
    return new CustomErrorHandler(401, message)
  }
  static unAuthorization(message: string="Access Denied") {
    return new CustomErrorHandler(401, message)
  }
  static serverError(message: string="Internal Server Error") {
    return new CustomErrorHandler(500, message)
  }
}

export default CustomErrorHandler
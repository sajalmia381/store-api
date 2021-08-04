class CustomErrorHandler extends Error {
  status: number;
  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
    Object.setPrototypeOf(this, CustomErrorHandler.prototype);
  }
  static alreadyExists(message: string) {
    return new CustomErrorHandler(409, message)
  }
  static invalidCredentials(message='User or Password is Wrong.') {
    return new CustomErrorHandler(401, message)
  }
  static unAuthorization(message="Access Denied") {
    return new CustomErrorHandler(401, message)
  }
  static serverError(message="Internal Server Error") {
    return new CustomErrorHandler(500, message)
  }
  static notAllow(message="Not allow") {
    return new CustomErrorHandler(405, message)
  }
}

export default CustomErrorHandler;
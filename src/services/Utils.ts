class Utils {
  static getRandomString(length=5): string {
    return Math.random().toString(36).substr(2, length)
  }
}

export default Utils;
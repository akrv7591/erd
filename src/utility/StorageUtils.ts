export default class StorageUtils {
  static setAuthorization(authorization: string) {
    localStorage.removeItem("Authorization")
    sessionStorage.removeItem("Authorization")

    localStorage.setItem("Authorization", authorization)
    sessionStorage.setItem("Authorization", authorization)
  }

  static getAuthorization() {
    return localStorage.getItem("Authorization") || ""
  }

  static removeAuthorization() {
    localStorage.removeItem("Authorization")
    sessionStorage.removeItem("Authorization")
  }
}

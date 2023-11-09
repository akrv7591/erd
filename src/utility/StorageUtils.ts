export default class StorageUtils {
  static setAuthorization(authorization: string) {
    localStorage.removeItem("Authorization")
    sessionStorage.removeItem("Authorization")

    localStorage.setItem("Authorization", authorization)
    sessionStorage.setItem("Authorization", authorization)
  }

  static removeAuthorization() {
    localStorage.removeItem("Authorization")
    sessionStorage.removeItem("Authorization")
  }
}

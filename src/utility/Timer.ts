export default class Timer {
  static sleep (milliseconds: number){
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, milliseconds)
    })
  }
}

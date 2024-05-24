import {AxiosResponse} from "axios";

export class ApiUtils {
  static isRequestSuccess(response: AxiosResponse) {
    return response.status >= 200 && response.status < 300
  }
}

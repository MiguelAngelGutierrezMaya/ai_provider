import { HttpUtil } from '../../models/utils/http.util';

//
// HttpRequestUseCase
//
export class HttpRequestUseCase {
  //
  // makeGetRequest
  // - client: HttpUtil
  // - options: { [key: string]: any
  // - returns: Promise<{ [key: string]: any }>
  //
  static async makeGetRequest(
    client: HttpUtil,
    options: { [key: string]: any },
  ): Promise<{ [key: string]: any }> {
    return client.get(options);
  }

  //
  // makePostRequest
  // - client: HttpUtil
  // - data: { [key: string]: any }
  // - returns: Promise<{ [key: string]: any }>
  //
  static async makePostRequest(
    client: HttpUtil,
    data: { [key: string]: any },
  ): Promise<{ [key: string]: any }> {
    return client.post(data);
  }

  //
  // makePutRequest
  // - client: HttpUtil
  // - data: { [key: string]: any }
  // - returns: Promise<{ [key: string]: any }>
  //
  static async makePutRequest(
    client: HttpUtil,
    data: { [key: string]: any },
  ): Promise<{ [key: string]: any }> {
    return client.put(data);
  }

  //
  // makeDeleteRequest
  // - client: HttpUtil
  // - options: { [key: string]: any }
  // - returns: Promise<{ [key: string]: any }>
  //
  static async makeDeleteRequest(
    client: HttpUtil,
    options: { [key: string]: any },
  ): Promise<{ [key: string]: any }> {
    return client.delete(options);
  }

  //
  // makePatchRequest
  // - client: HttpUtil
  // - data: { [key: string]: any }
  // - returns: Promise<{ [key: string]: any }>
  //
  static async makePatchRequest(
    client: HttpUtil,
    data: { [key: string]: any },
  ): Promise<{ [key: string]: any }> {
    return client.patch(data);
  }
}

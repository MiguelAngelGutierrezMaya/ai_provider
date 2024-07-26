import { HttpUtil } from '../../../../shared/models/utils/http.util';

export class HttpUtilMock implements HttpUtil {
  constructor() {}

  delete(data: { [p: string]: any }): Promise<{ [p: string]: any }> {
    return Promise.resolve(data);
  }

  get(options: { [p: string]: any }): Promise<{ [p: string]: any }> {
    return Promise.resolve(options);
  }

  patch(data: { [p: string]: any }): Promise<{ [p: string]: any }> {
    return Promise.resolve(data);
  }

  post(data: { [p: string]: any }): Promise<{ [p: string]: any }> {
    return Promise.resolve(data);
  }

  put(data: { [p: string]: any }): Promise<{ [p: string]: any }> {
    return Promise.resolve(data);
  }
}

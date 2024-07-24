import { Injectable } from '@nestjs/common';
import { HttpUtil } from '../../models/utils/http.util';

@Injectable()
export class FetchHttpClientService implements HttpUtil {
  constructor() {}

  async get(options: { [key: string]: any }): Promise<{ [key: string]: any }> {
    const { url, headers, query } = options;
    const parsedUrl = new URL(url);

    if (query) {
      Object.keys(query).forEach((key) => {
        if (Array.isArray(query[key])) {
          query[key].forEach((value) => {
            parsedUrl.searchParams.append(`${key}[]`, value);
          });
        } else {
          parsedUrl.searchParams.append(key, query[key]);
        }
      });
    }

    const response: Response = await fetch(parsedUrl, {
      method: 'GET',
      headers: headers,
    });

    return await response.json();
  }

  async post(data: { [key: string]: any }): Promise<{ [key: string]: any }> {
    const { url, headers, body, isFormData } = data;

    const response: Response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: isFormData ? body : JSON.stringify(body),
    });

    return await response.json();
  }

  async put(data: { [key: string]: any }): Promise<{ [key: string]: any }> {
    const { url, headers, body } = data;

    const response: Response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body),
    });

    return await response.json();
  }

  async delete(data: { [key: string]: any }): Promise<{ [key: string]: any }> {
    const { url, headers, body } = data;

    const response: Response = await fetch(url, {
      method: 'DELETE',
      headers: headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return await response.json();
  }

  async patch(data: { [key: string]: any }): Promise<{ [key: string]: any }> {
    const { url, headers, body } = data;

    const response: Response = await fetch(url, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(body),
    });

    return await response.json();
  }
}

export interface HttpUtil {
  get: (options: { [key: string]: any }) => Promise<{ [key: string]: any }>;
  post: (data: { [key: string]: any }) => Promise<{ [key: string]: any }>;
  put: (data: { [key: string]: any }) => Promise<{ [key: string]: any }>;
  delete: (data: { [key: string]: any }) => Promise<{ [key: string]: any }>;
  patch: (data: { [key: string]: any }) => Promise<{ [key: string]: any }>;
}

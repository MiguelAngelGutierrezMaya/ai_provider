export interface CustomResponseInterface {
  payload: { [key: string]: any };
  status: boolean;
  errors?: string[] | { [key: string]: any }[];
  message: string;
}

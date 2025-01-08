export interface ResponseDto<Context = null> {
  success: boolean;

  message?: string;

  data?: Context;
}

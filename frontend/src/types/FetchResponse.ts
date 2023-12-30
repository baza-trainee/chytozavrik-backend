export type FetchResponseType<T> =
  | {
      status: 'success';
      data: T;
    }
  | {
      status: 'fail';
      data: {
        message: string;
      };
    };

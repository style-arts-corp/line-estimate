import Axios from 'axios';
import { env } from '@/env';
// import { useFirebaseCurrentUser } from '@/lib/firebase/user';
// import { useAuth } from '@/providers/AuthProvider/useAuth';

const BASE_URL = env.NEXT_PUBLIC_API_URL;

export const AXIOS_INSTANCE = Axios.create({ baseURL: BASE_URL });

type CustomClient<T> = (data: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: string | string[][] | Record<string, string> | URLSearchParams;
  headers?: Record<string, string | number>;
  data?: BodyType<unknown>;
  signal?: AbortSignal;
}) => Promise<T>;

export const useCustomClient = <T>(): CustomClient<T> => {
  // const { fetchIdToken } = useFirebaseCurrentUser();
  // const { user } = useAuth();

  return async ({ url, method, params, data }) => {
    // const firebaseToken = await fetchIdToken();
    // const token = firebaseToken || user?.authToken || '';

    // params の要素のうち、undefined や null の場合は、paramsの要素を削除する
    const filteredParams = Object.fromEntries(
      Object.entries(params || {}).filter(
        ([, value]) => value !== undefined && value !== null,
      ),
    );
    const urlWithParams =
      filteredParams && Object.keys(filteredParams).length > 0
        ? `${BASE_URL}${url}?${new URLSearchParams(filteredParams).toString()}`
        : `${BASE_URL}${url}`;

    const response = fetch(urlWithParams, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
        ...data?.headers,
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
    }).then(async (response) => {
      let responseData: T;
      try {
        responseData = (await response.json()) as T;
      } catch (err) {
        // NOTE:JSONの変換処理エラーは一旦スルーとする(空のresponseの際に発生)
        if (err instanceof SyntaxError) {
          return undefined as T;
        }

        // TODO: エラーを後ほど分岐する
        return undefined as T;
      }

      // TODO: 詳細なエラーハンドリングを行う
      if (!response.ok) {
        // NOTE: react-queryにエラーとして扱わせるためにエラーをthrowする(ここでthrowしないとエラーとして扱われないので注意)
        throw responseData;
      }

      return responseData;
    });

    return await response;
  };
};

export default useCustomClient;

export type ErrorType<ErrorData> = ErrorData;

export type BodyType<BodyData> = BodyData & {
  headers?: Record<string, string | number>;
};

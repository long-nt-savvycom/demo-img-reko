import { useAuthStore } from "../store/authStore";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const apiCall = async <T>(
  url: string,
  method: HttpMethod = "GET",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any = null,
  customHeaders: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  const { token } = useAuthStore.getState();
  const defaultHeaders: Record<string, string> = {
    Authorization: token as string,
  };

  const headers = { ...defaultHeaders, ...customHeaders };

  const options: RequestInit = {
    method,
    headers,
  };

  // if method isn't GET, add body to options
  if (body && method !== "GET") {
    options.body = body;
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: T = await response.json();
    return { data };
  } catch (error) {
    console.error("API call error:", error);
    return { error: (error as Error).message };
  }
};

export const convertTimestamp = (time: string) => {
  const date = new Date(time);
  return date.getTime();
};

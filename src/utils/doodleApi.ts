export type ApiChatMessage = {
  _id: string;
  author: string;
  message: string;
  timestamp: number;
  token: string;
};

export type LocalChatMessage = Omit<ApiChatMessage, "timestamp"> & {
  sentAt: Date;
};

type ApiErrorDetail = {
  location: string;
  msg: string;
  param: string;
};

type ApiErrorResponse = {
  errors: Record<string, ApiErrorDetail>;
};

type SendMessageRequest = {
  author: string;
  message: string;
};

export class ApiError extends Error {
  response: ApiErrorResponse;

  constructor(message: string, response: ApiErrorResponse) {
    super(message);
    this.response = response;
  }
}

const convertApiMessage = (message: ApiChatMessage): LocalChatMessage => ({
  _id: message._id,
  author: message.author,
  message: message.message,
  sentAt: new Date(message.timestamp),
  token: message.token,
});

export const fetchMessages = ({
  since,
  limit,
}: {
  since?: Date;
  limit?: number;
} = {}): Promise<LocalChatMessage[]> => {
  const getParams = new URLSearchParams({
    token: process.env.REACT_APP_DOODLE_API_TOKEN || "",
  });

  if (since)
    getParams.set("since", Math.floor(since.getTime() / 1000).toString());
  if (limit) getParams.set("limit", limit.toString());

  return apiRequest<ApiChatMessage[]>({ method: "GET", getParams }).then(
    (messages) => messages.map(convertApiMessage)
  );
};

export const sendMessage = ({ author, message }: SendMessageRequest) =>
  apiRequest<ApiChatMessage, SendMessageRequest>({
    method: "POST",
    getParams: new URLSearchParams({
      token: process.env.REACT_APP_DOODLE_API_TOKEN || "",
    }),
    postBody: { author, message },
  }).then((message) => convertApiMessage(message));

const apiRequest = <ResponseBody, PostRequestBody = {}>({
  method,
  getParams,
  postBody,
}: {
  method: "POST" | "GET";
  getParams?: URLSearchParams;
  postBody?: PostRequestBody;
}): Promise<ResponseBody> =>
  fetch(
    `${process.env.REACT_APP_DOODLE_API_BASE_URL}${
      getParams ? `?${getParams}` : ""
    }`,
    method === "POST"
      ? {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postBody),
        }
      : {}
  ).then(async (response) => {
    const responseJson = await response.json();

    if (!response.ok) {
      throw new ApiError(
        `Request to fetch messages returned ${response.status} status`,
        responseJson
      );
    }
    return responseJson;
  });

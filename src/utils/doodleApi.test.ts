import { ApiError, fetchMessages, sendMessage } from "./doodleApi";

describe("Doodle Api Client", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockApiMessage = {
    _id: "60ec4ba93adb62001af39745",
    author: "Doodle",
    message: "test 3",
    timestamp: 1639334298794,
    token: "NqebNLtXsswN",
  };

  const expectedMessage = {
    _id: "60ec4ba93adb62001af39745",
    author: "Doodle",
    message: "test 3",
    sentAt: new Date(1639334298794 * 1000),
    token: "NqebNLtXsswN",
  };

  const expectedBaseUrl = `${process.env.REACT_APP_DOODLE_API_BASE_URL}?token=${process.env.REACT_APP_DOODLE_API_TOKEN}`;

  describe("fetchMessages", () => {
    it("requests messages from the API", async () => {
      const mockResponse = {
        json: () => Promise.resolve([mockApiMessage]),
        ok: true,
        status: 200,
      } as Response;

      jest.spyOn(global, "fetch").mockResolvedValue(mockResponse);

      const messages = await fetchMessages();
      expect(global.fetch).toBeCalledWith(expectedBaseUrl, {});
      expect(messages).toEqual([expectedMessage]);
    });

    describe("requesting messages since a given time/date", () => {
      it("adds the time to the url as a unix timestamp", async () => {
        const mockResponse = {
          json: () => Promise.resolve([mockApiMessage]),
          ok: true,
          status: 200,
        } as Response;

        jest.spyOn(global, "fetch").mockResolvedValue(mockResponse);

        const since = new Date();

        const messages = await fetchMessages({ since });
        expect(global.fetch).toBeCalledWith(
          `${expectedBaseUrl}&since=${Math.floor(since.getTime() / 1000)}`,
          {}
        );
        expect(messages).toEqual([expectedMessage]);
      });
    });

    describe("requesting a limited number of messages", () => {
      it("adds a limit parameter to the url", async () => {
        const mockResponse = {
          json: () => Promise.resolve([mockApiMessage]),
          ok: true,
          status: 200,
        } as Response;

        jest.spyOn(global, "fetch").mockResolvedValue(mockResponse);

        const limit = 5;

        const messages = await fetchMessages({ limit });
        expect(global.fetch).toBeCalledWith(
          `${expectedBaseUrl}&limit=${limit}`,
          {}
        );
        expect(messages).toEqual([expectedMessage]);
      });
    });

    describe("when the request fails", () => {
      it("raises an error with the response status", async () => {
        jest.spyOn(global, "fetch").mockReturnValue(
          Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve(null),
          } as Response)
        );

        await expect(() => fetchMessages()).rejects.toThrow(
          "Request to fetch messages returned 500 status"
        );
      });
    });
  });

  describe("sendMessage", () => {
    it("sends a new message to the API", async () => {
      const mockResponse = {
        json: () => Promise.resolve(mockApiMessage),
        ok: true,
        status: 200,
      } as Response;

      jest.spyOn(global, "fetch").mockResolvedValue(mockResponse);

      const messageRequest = {
        author: "Test Author",
        message: "test message",
      };
      const message = await sendMessage(messageRequest);
      expect(global.fetch).toBeCalledWith(expectedBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageRequest),
      });
      expect(message).toEqual(expectedMessage);
    });

    describe("the API returns an error", () => {
      it("throws an ApiError", async () => {
        jest.spyOn(global, "fetch").mockReturnValue(
          Promise.resolve({
            ok: false,
            status: 500,
            json: () =>
              Promise.resolve({
                errors: {
                  message: {
                    location: "body",
                    msg: "message should be between 1 and 256 characters long",
                    param: "message",
                  },
                },
              }),
          } as Response)
        );

        await expect(() =>
          sendMessage({ author: "Test Author", message: "" })
        ).rejects.toThrow(ApiError);
      });
    });
  });
});

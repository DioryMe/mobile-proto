import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { DiosphereProvider, useDiosphereContext } from "./DiosphereContext";
import { fetchData } from "../hooks/fetchData";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "8670abb3-253a-4750-b5a7-1476d2effd60"),
}));

jest.mock("../hooks/fetchData", () => ({
  fetchData: jest.fn(),
}));

const mockDiographData = {
  "/": {
    id: "/",
    text: "Mocked root diory",
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
};

const demoDiographJson = require("../diographUtils/diograph.json");

const TestComponent: React.FC = () => {
  const context = useDiosphereContext();

  return (
    <div>
      <div data-testid="myDioryDiograph">
        {context.myDioryRoom.diograph?.toJson() || "No myDiory diograph"}
      </div>
      <div data-testid="browseDiograph">
        {context.browseRoom.diograph?.toJson() || "No browse diograph"}
      </div>
      <div data-testid="loading">
        {context.loading ? "Loading" : "Not loading"}
      </div>
      <div data-testid="error">{context.error || "No Error"}</div>
    </div>
  );
};

const photoDioryId = "bea0b059-413d-42a8-a7ad-62d0f252b596";
const eventDioryId = "f4b3b3b4-0b3b-4b3b-8b3b-3b0b3b3b0b3b";
const personDioryId = "e07c2f1d-5f5a-488a-a505-34f7b9f55105";

const TestComponent2: React.FC = () => {
  const { myDioryRoom, browseRoom } = useDiosphereContext();

  return (
    <div>
      <div data-testid="myDioryFocusId">{myDioryRoom.focusId}</div>
      <div data-testid="myDioryStoryId">{myDioryRoom.storyId}</div>
      <div data-testid="myDioryPrev">{myDioryRoom.prev}</div>
      <div data-testid="myDioryStoriesLength">{myDioryRoom.stories.length}</div>

      <div data-testid="browseFocusId">{browseRoom.focusId}</div>
      <div data-testid="browseStoryId">{browseRoom.storyId}</div>
      <div data-testid="browsePrev">{browseRoom.prev}</div>
      <div data-testid="browseStoriesLength">{browseRoom.stories.length}</div>

      <button
        data-testid="changeMyDioryFocus"
        onClick={() => myDioryRoom.setFocusId(photoDioryId)}
      >
        Change MyDiory focusId
      </button>
      <button
        data-testid="changeBrowseFocus"
        onClick={() => browseRoom.setFocusId(photoDioryId)}
      >
        Change Browse focusId
      </button>

      <button onClick={() => myDioryRoom.setStoryId(eventDioryId)}>
        Change MyDiory storyId
      </button>
      <button onClick={() => browseRoom.setStoryId(personDioryId)}>
        Change Browse storyId
      </button>
    </div>
  );
};

describe("DiosphereContext", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test("changing focusId changes storyId and number of stories", async () => {
    (fetchData as jest.Mock).mockImplementation(async (url: string) => {
      return demoDiographJson;
    });

    render(
      <DiosphereProvider>
        <TestComponent2 />
      </DiosphereProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("myDioryFocusId").textContent).toBe("/");
      expect(screen.getByTestId("myDioryStoriesLength").textContent).toBe("0");
      expect(screen.getByTestId("browseFocusId").textContent).toBe("/");
      expect(screen.getByTestId("browseStoriesLength").textContent).toBe("0");

      fireEvent.click(screen.getByTestId("changeMyDioryFocus"));
      expect(screen.getByTestId("myDioryFocusId").textContent).toBe(
        photoDioryId
      );
      expect(screen.getByTestId("myDioryStoriesLength").textContent).toBe("3");

      fireEvent.click(screen.getByTestId("changeBrowseFocus"));
      expect(screen.getByTestId("browseFocusId").textContent).toBe(
        photoDioryId
      );
      expect(screen.getByTestId("browseStoriesLength").textContent).toBe("3");
    });
  });

  describe("sets diographs, loading and error correctly", () => {
    test("immediate success for both", async () => {
      (fetchData as jest.Mock).mockImplementation(async (url: string) => {
        return mockDiographData;
      });

      render(
        <DiosphereProvider>
          <TestComponent />
        </DiosphereProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("browseDiograph").textContent).toBe(
          JSON.stringify(mockDiographData, null, 2)
        );
        expect(screen.getByTestId("myDioryDiograph").textContent).toBe(
          JSON.stringify(mockDiographData, null, 2)
        );
        expect(screen.getByTestId("loading").textContent).toBe("Not loading");
        expect(screen.getByTestId("error").textContent).toEqual("No Error");
      });
    });

    test("success with delay for both", async () => {
      jest.useFakeTimers();
      const mockFetchData = async (url: string): Promise<any> => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockDiographData);
          }, 10000);
        });
      };
      (fetchData as jest.Mock).mockImplementation(mockFetchData);

      const { rerender } = render(
        <DiosphereProvider>
          <TestComponent />
        </DiosphereProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("browseDiograph").textContent).toBe(
          "No browse diograph"
        );
        expect(screen.getByTestId("myDioryDiograph").textContent).toBe(
          "No myDiory diograph"
        );
        expect(screen.getByTestId("loading").textContent).toBe("Loading");
        expect(screen.getByTestId("error").textContent).toEqual("No Error");
      });

      jest.advanceTimersByTime(10000);

      rerender(
        <DiosphereProvider>
          <TestComponent />
        </DiosphereProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("browseDiograph").textContent).toBe(
          JSON.stringify(mockDiographData, null, 2)
        );
        expect(screen.getByTestId("myDioryDiograph").textContent).toBe(
          JSON.stringify(mockDiographData, null, 2)
        );
        expect(screen.getByTestId("loading").textContent).toBe("Not loading");
        expect(screen.getByTestId("error").textContent).toEqual("No Error");
      });
    });

    test("immediate error on both", async () => {
      (fetchData as jest.Mock).mockImplementation(async (url: string) => {
        throw new Error(`Failed to fetch ${url}`);
      });

      render(
        <DiosphereProvider>
          <TestComponent />
        </DiosphereProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("browseDiograph").textContent).toBe(
          "No browse diograph"
        );
        expect(screen.getByTestId("myDioryDiograph").textContent).toBe(
          "No myDiory diograph"
        );
        expect(screen.getByTestId("loading").textContent).toBe("Not loading");
        expect(screen.getByTestId("error").textContent).toEqual(
          "myDioryDiograph: Failed to fetch /room/native/diograph, browseDiograph: Failed to fetch /room/demo/diograph"
        );
      });
    });

    test("consequtive errors with delay", async () => {
      jest.useFakeTimers();
      const mockFetchData = async (url: string): Promise<any> => {
        if (url === "/room/native/diograph") {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(new Error(`Failed to fetch ${url}`));
            }, 10000);
          });
        }
        throw new Error(`Failed to fetch ${url}`);
      };
      (fetchData as jest.Mock).mockImplementation(mockFetchData);

      const { rerender } = render(
        <DiosphereProvider>
          <TestComponent />
        </DiosphereProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("browseDiograph").textContent).toBe(
          "No browse diograph"
        );
        expect(screen.getByTestId("myDioryDiograph").textContent).toBe(
          "No myDiory diograph"
        );
        expect(screen.getByTestId("loading").textContent).toBe("Loading");
        expect(screen.getByTestId("error").textContent).toEqual(
          "browseDiograph: Failed to fetch /room/demo/diograph"
        );
      });

      jest.advanceTimersByTime(15000);

      rerender(
        <DiosphereProvider>
          <TestComponent />
        </DiosphereProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("browseDiograph").textContent).toBe(
          "No browse diograph"
        );
        expect(screen.getByTestId("myDioryDiograph").textContent).toBe(
          "No myDiory diograph"
        );
        expect(screen.getByTestId("loading").textContent).toBe("Not loading");
        expect(screen.getByTestId("error").textContent).toEqual(
          "myDioryDiograph: Failed to fetch /room/native/diograph, browseDiograph: Failed to fetch /room/demo/diograph"
        );
      });
    });

    test("success and error with delay", async () => {
      jest.useFakeTimers();
      const mockFetchData = async (url: string): Promise<any> => {
        if (url === "/room/native/diograph") {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(new Error(`Failed to fetch ${url}`));
            }, 10000);
          });
        }
        return mockDiographData;
      };
      (fetchData as jest.Mock).mockImplementation(mockFetchData);

      const { rerender } = render(
        <DiosphereProvider>
          <TestComponent />
        </DiosphereProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("browseDiograph").textContent).toBe(
          JSON.stringify(mockDiographData, null, 2)
        );
        expect(screen.getByTestId("myDioryDiograph").textContent).toBe(
          "No myDiory diograph"
        );
        expect(screen.getByTestId("loading").textContent).toBe("Loading");
        expect(screen.getByTestId("error").textContent).toEqual("No Error");
      });

      jest.advanceTimersByTime(15000);

      rerender(
        <DiosphereProvider>
          <TestComponent />
        </DiosphereProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("browseDiograph").textContent).toBe(
          JSON.stringify(mockDiographData, null, 2)
        );
        expect(screen.getByTestId("myDioryDiograph").textContent).toBe(
          "No myDiory diograph"
        );
        expect(screen.getByTestId("loading").textContent).toBe("Not loading");
        expect(screen.getByTestId("error").textContent).toEqual(
          "myDioryDiograph: Failed to fetch /room/native/diograph"
        );
      });
    });

    test("error and success with delay", async () => {
      jest.useFakeTimers();
      const mockFetchData = async (url: string): Promise<any> => {
        if (url === "/room/demo/diograph") {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(mockDiographData);
            }, 10000);
          });
        }
        throw new Error(`Failed to fetch ${url}`);
      };
      (fetchData as jest.Mock).mockImplementation(mockFetchData);

      const { rerender } = render(
        <DiosphereProvider>
          <TestComponent />
        </DiosphereProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("browseDiograph").textContent).toBe(
          "No browse diograph"
        );
        expect(screen.getByTestId("myDioryDiograph").textContent).toBe(
          "No myDiory diograph"
        );
        expect(screen.getByTestId("loading").textContent).toBe("Loading");
        expect(screen.getByTestId("error").textContent).toEqual(
          "myDioryDiograph: Failed to fetch /room/native/diograph"
        );
      });

      jest.advanceTimersByTime(15000);

      rerender(
        <DiosphereProvider>
          <TestComponent />
        </DiosphereProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("browseDiograph").textContent).toBe(
          JSON.stringify(mockDiographData, null, 2)
        );
        expect(screen.getByTestId("myDioryDiograph").textContent).toBe(
          "No myDiory diograph"
        );
        expect(screen.getByTestId("loading").textContent).toBe("Not loading");
        expect(screen.getByTestId("error").textContent).toEqual(
          "myDioryDiograph: Failed to fetch /room/native/diograph"
        );
      });
    });
  });
});

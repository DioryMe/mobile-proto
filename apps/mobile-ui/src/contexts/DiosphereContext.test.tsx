import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
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

const TestComponent: React.FC = () => {
  const context = useDiosphereContext();

  return (
    <div>
      <div data-testid="myDioryDiograph">
        {context.myDioryRoom?.diograph?.toJson() || "No myDiory diograph"}
      </div>
      <div data-testid="browseDiograph">
        {context.browseRoom?.diograph?.toJson() || "No browse diograph"}
      </div>
      <div data-testid="loading">
        {context.loading ? "Loading" : "Not loading"}
      </div>
      <div data-testid="error">{context.error || "No Error"}</div>
    </div>
  );
};

describe("DiosphereContext", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
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

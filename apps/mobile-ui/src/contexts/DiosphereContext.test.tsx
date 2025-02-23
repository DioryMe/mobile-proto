import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { DiosphereProvider, useDiosphereContext } from "./DiosphereContext";
import useFetchData from "../hooks/useFetchData";

// Mock the useFetchData hook
jest.mock("../hooks/useFetchData");
const mockedUseFetchData = useFetchData as jest.MockedFunction<
  typeof useFetchData
>;

// Test component to consume the context
const TestComponent: React.FC = () => {
  const context = useDiosphereContext();

  return (
    <div>
      <div data-testid="loading">
        {context.loading ? "Loading" : "Not Loading"}
      </div>
      <div data-testid="error">{context.error || "No Error"}</div>
    </div>
  );
};

describe("DiosphereContext", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("sets loading and error correctly on successful fetch", async () => {
    // Mock successful fetch for both rooms
    mockedUseFetchData.mockImplementation((url: string) => {
      if (url.includes("/myDioryRoom")) {
        return {
          result: {
            /* mock diograph data */
          },
          loading: false,
          error: null,
          cancelFetch: jest.fn(),
        };
      }
      if (url.includes("/browseRoom")) {
        return {
          result: {
            /* mock diograph data */
          },
          loading: false,
          error: null,
          cancelFetch: jest.fn(),
        };
      }
      return {
        result: null,
        loading: false,
        error: null,
        cancelFetch: jest.fn(),
      };
    });

    render(
      <DiosphereProvider>
        <TestComponent />
      </DiosphereProvider>
    );

    // Initially, loading might be true depending on implementation
    // Adjust the expectation based on actual initial state
    expect(screen.getByTestId("loading").textContent).toBe("Loading");

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("Not Loading");
      expect(screen.getByTestId("error").textContent).toBe("No Error");
    });
  });

  test("sets loading and error correctly on fetch error", async () => {
    // Mock error fetch for both rooms
    mockedUseFetchData.mockImplementation((url: string) => {
      if (url.includes("/myDioryRoom")) {
        return {
          result: null,
          loading: false,
          error: "Failed to fetch myDioryDiograph",
          cancelFetch: jest.fn(),
        };
      }
      if (url.includes("/browseRoom")) {
        return {
          result: null,
          loading: false,
          error: "Failed to fetch browseDiograph",
          cancelFetch: jest.fn(),
        };
      }
      return {
        result: null,
        loading: false,
        error: null,
        cancelFetch: jest.fn(),
      };
    });

    render(
      <DiosphereProvider>
        <TestComponent />
      </DiosphereProvider>
    );

    // Initially, loading might be true depending on implementation
    expect(screen.getByTestId("loading").textContent).toBe("Loading");

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("Not Loading");
      expect(screen.getByTestId("error").textContent).toContain(
        "myDioryDiograph"
      );
      expect(screen.getByTestId("error").textContent).toContain(
        "browseDiograph"
      );
    });
  });
});

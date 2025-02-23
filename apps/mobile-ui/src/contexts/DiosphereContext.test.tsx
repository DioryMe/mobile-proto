import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { DiosphereProvider, useDiosphereContext } from "./DiosphereContext";
import useFetchData from "../hooks/useFetchData";

jest.mock("../hooks/useFetchData");
const mockedUseFetchData = useFetchData as jest.MockedFunction<
  typeof useFetchData
>;

const mockDiographData = {
  id: "/",
  text: "Root",
};

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
    mockedUseFetchData.mockImplementation((url: string) => ({
      result: mockDiographData,
      loading: false,
      error: null,
      cancelFetch: jest.fn(),
    }));

    render(
      <DiosphereProvider>
        <TestComponent />
      </DiosphereProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("Not Loading");
      expect(screen.getByTestId("error").textContent).toBe("No Error");
    });
  });

  test("sets loading and error correctly on fetch error", async () => {
    mockedUseFetchData.mockImplementation((url: string) => ({
      result: null,
      loading: false,
      error: `Failed to fetch ${url}`,
      cancelFetch: jest.fn(),
    }));

    render(
      <DiosphereProvider>
        <TestComponent />
      </DiosphereProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("Not Loading");
      expect(screen.getByTestId("error").textContent).toEqual(
        "myDioryDiograph: Failed to fetch /room/native/diograph, browseDiograph: Failed to fetch /room/demo/diograph"
      );
    });
  });
});

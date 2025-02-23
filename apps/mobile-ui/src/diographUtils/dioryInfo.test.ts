import { IDiographObject } from "@diograph/diograph/types";
import { getDioryInfo, DioryInfo } from "./dioryInfo";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "8670abb3-253a-4750-b5a7-1476d2effd60"),
}));
describe("getDioryInfo", () => {
  const mockDiographJson: IDiographObject = {
    "/": {
      id: "/",
      text: "Mocked root diory",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    },
  };

  it("should return a DioryInfo object", () => {
    const dioryInfo: DioryInfo = getDioryInfo(mockDiographJson);
    expect(dioryInfo).toBeDefined();
    expect(dioryInfo.diograph?.toObject()["/"].text).toEqual(
      "Mocked root diory"
    );
    expect(dioryInfo.focusId).toBe("focusId");
  });
});

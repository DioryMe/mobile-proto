import { IDiographObject } from "@diograph/diograph/types";
import { getDioryInfo, DioryInfo } from "./dioryInfo";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "8670abb3-253a-4750-b5a7-1476d2effd60"),
}));

const mockDiographJson: IDiographObject = {
  "/": {
    id: "/",
    text: "Mocked root diory",
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
};

describe("getDioryInfo", () => {
  it("returns a DioryInfo object based on mockDiographJson", () => {
    const dioryInfo: DioryInfo = getDioryInfo(mockDiographJson);

    expect(dioryInfo).toMatchObject({
      diograph: expect.any(Object),
      storyId: null,
      stories: [],
      focusId: "/",
      prev: null,
      next: null,
      focus: {
        content: null, // { contentUrl: "content" },
        image: null,
        latlng: null,
        date: null,
        linked: [],
      },
      focusDiory: expect.any(Object),
    });
  });
});

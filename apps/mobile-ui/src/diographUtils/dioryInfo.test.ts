import { IDiographObject } from "@diograph/diograph/types";
import { getDioryInfo, DioryInfo } from "./dioryInfo";

const demoDiograph = require("./diograph.json");

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
      focusId: "/",
      storyId: null,
      stories: [],
      prev: null,
      next: null,
      focus: {
        text: "Mocked root diory",
        image: null,
        latlng: null,
        date: null,
        linked: [],
        content: null, // { contentUrl: "content" },
      },
      focusDiory: expect.any(Object),
    });
  });

  describe("demoDiograph", () => {
    it("root diory", () => {
      const dioryInfo: DioryInfo = getDioryInfo(demoDiograph);

      expect(dioryInfo).toMatchObject({
        diograph: expect.any(Object),
        focusId: "/",
        storyId: null,
        stories: [],
        prev: null,
        next: null,
        focus: {
          text: "Diory demo content",
          image: "demo-content.png",
          latlng: null,
          date: null,
          linked: [
            "ef79b80c-e319-4bfb-8faa-ebbc1150f27f",
            "generic-content",
            "3e2ddc49-b3b6-4212-8a0a-80b9150a57ae",
            "e07c2f1d-5f5a-488a-a505-34f7b9f55105",
            "506cd9dd-97f4-4b98-9172-87f5c8966ade",
            "d031d5a8-0a37-49cb-b800-54e437a7c78e",
            "f1470597-1a3c-4a76-8546-2c29591a6846",
            "map-content",
          ],
          content: null, // { contentUrl: "content" },
        },
        focusDiory: expect.any(Object),
      });
    });
  });
});

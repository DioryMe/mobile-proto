import { IDiographObject } from "@diograph/diograph/types";
import { getDioryInfo, DioryInfo } from "./dioryInfo";
import { Diograph } from "@diograph/diograph";

const demoDiographJson = require("./diograph.json");
const demoDiograph = new Diograph(demoDiographJson);

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
    const dioryInfo: DioryInfo = getDioryInfo(new Diograph(mockDiographJson));

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
        links: [],
        data: null,
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
          links: [
            "ef79b80c-e319-4bfb-8faa-ebbc1150f27f",
            "generic-content",
            "3e2ddc49-b3b6-4212-8a0a-80b9150a57ae",
            "e07c2f1d-5f5a-488a-a505-34f7b9f55105",
            "506cd9dd-97f4-4b98-9172-87f5c8966ade",
            "d031d5a8-0a37-49cb-b800-54e437a7c78e",
            "f1470597-1a3c-4a76-8546-2c29591a6846",
            "map-content",
          ],
          data: null,
        },
        focusDiory: expect.any(Object),
      });
    });

    it("Diory 12", () => {
      const dioryInfo: DioryInfo = getDioryInfo(demoDiograph, "diory12");

      expect(dioryInfo).toMatchObject({
        diograph: expect.any(Object),
        focusId: "diory12",
        storyId: "diory1",
        stories: ["diory1"],
        prev: "diory11",
        next: "diory13",
        focus: {
          text: "Diory 12",
          image: expect.any(String),
          latlng: null,
          date: null,
          links: [],
          data: null,
        },
        focusDiory: expect.any(Object),
      });
    });

    describe("Photo with Mary & Jane", () => {
      const dioryId = "bea0b059-413d-42a8-a7ad-62d0f252b596";
      const latlng = "39.16727289119642, -77.51675583422184";
      const date = "2013-06-25T23:11:09.000Z";
      const data = {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        contentUrl:
          "bafkreifgddwk2ymrc7neoniqdcolrgmvrfqfiknvbagusvxoa5hfca7cle",
        height: 1188,
        width: 1782,
        encodingFormat: "image/jpeg",
      };

      it("Without explicitly selected story", () => {
        const storyId = undefined;
        const dioryInfo: DioryInfo = getDioryInfo(
          demoDiograph,
          dioryId,
          storyId
        );

        expect(dioryInfo).toMatchObject({
          diograph: expect.any(Object),
          focusId: dioryId,
          storyId: "3e2ddc49-b3b6-4212-8a0a-80b9150a57ae",
          stories: [
            "3e2ddc49-b3b6-4212-8a0a-80b9150a57ae",
            "e07c2f1d-5f5a-488a-a505-34f7b9f55105",
            "f1470597-1a3c-4a76-8546-2c29591a6846",
          ],
          prev: "dd1a14b9-f564-4c2c-8330-df29cd78ac45",
          next: null,
          focus: {
            text: null,
            image: expect.any(String),
            latlng,
            date,
            links: [],
            data,
          },
          focusDiory: expect.any(Object),
        });
      });

      it("Selected story: Scouts BSA International (event)", () => {
        const storyId = "f1470597-1a3c-4a76-8546-2c29591a6846";
        const dioryInfo: DioryInfo = getDioryInfo(
          demoDiograph,
          dioryId,
          storyId
        );

        expect(dioryInfo).toMatchObject({
          diograph: expect.any(Object),
          focusId: dioryId,
          storyId: storyId || null,
          stories: [
            "3e2ddc49-b3b6-4212-8a0a-80b9150a57ae",
            "e07c2f1d-5f5a-488a-a505-34f7b9f55105",
            "f1470597-1a3c-4a76-8546-2c29591a6846",
          ],
          prev: "103f852d-4a2a-44de-8f4f-08ccddc3d280",
          next: "640518ab-fd17-4b22-9fae-ed4a0384d12f",
          focus: {
            text: null,
            image: expect.any(String),
            latlng,
            date,
            links: [],
            data,
          },
          focusDiory: expect.any(Object),
        });
      });

      it("Selected story: Mary", () => {
        const storyId = "e07c2f1d-5f5a-488a-a505-34f7b9f55105";
        const dioryInfo: DioryInfo = getDioryInfo(
          demoDiograph,
          dioryId,
          storyId
        );

        expect(dioryInfo).toMatchObject({
          diograph: expect.any(Object),
          focusId: dioryId,
          storyId: storyId || null,
          stories: [
            "3e2ddc49-b3b6-4212-8a0a-80b9150a57ae",
            "e07c2f1d-5f5a-488a-a505-34f7b9f55105",
            "f1470597-1a3c-4a76-8546-2c29591a6846",
          ],
          prev: "78661050-900d-4e87-84e2-a5262fca6770",
          next: "f1470597-1a3c-4a76-8546-2c29591a6846",
          focus: {
            text: null,
            image: expect.any(String),
            latlng,
            date,
            links: [],
            data,
          },
          focusDiory: expect.any(Object),
        });
      });
    });
  });
});

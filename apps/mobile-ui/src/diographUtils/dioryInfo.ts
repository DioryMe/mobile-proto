import { Diograph } from "@diograph/diograph";
import { IDiographObject, IDiory } from "@diograph/diograph/types";

export interface DioryInfo {
  diograph: Diograph | null;
  focusId: string;
  storyId: string | null;
  stories: string[];
  prev: string | null;
  next: string | null;
  focus: {
    text: string | null;
    image: string | null;
    latlng: string | null;
    date: string | null;
    links: string[];
    content: { contentUrl: string } | null;
  };
  focusDiory: IDiory;
  relatedGeo: string[];
  relatedTime: string[];
  relatedStories: string[];
  delete: () => void;
  link: () => void;
  edit: () => void;
}

export const getDioryInfo = (
  diographJson: IDiographObject,
  focusId: string = "/",
  storyId?: string
): DioryInfo => {
  const diograph = new Diograph(diographJson);
  const focusDiory = diograph.getDiory({ id: focusId });
  const { text, image, latlng, date } = focusDiory;
  return {
    diograph: new Diograph(diographJson),
    focusId: focusDiory.id,
    storyId: null,
    stories: [],
    prev: null,
    next: null,
    focus: {
      content: null, // { contentUrl: "content" },
      text: text || null,
      image: image || null,
      latlng: latlng || null,
      date: date || null,
      links: focusDiory.links?.map((link) => link.id) || [],
    },
    focusDiory,
    relatedGeo: ["relatedGeo"],
    relatedTime: ["relatedTime"],
    relatedStories: ["relatedStories"],
    delete: () => {
      return;
    },
    link: () => {
      return;
    },
    edit: () => {
      return;
    },
  };
};

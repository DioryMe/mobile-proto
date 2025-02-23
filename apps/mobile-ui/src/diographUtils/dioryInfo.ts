import { Diograph } from "@diograph/diograph";
import { IDiographObject } from "@diograph/diograph/types";

export interface DioryInfo {
  diograph: Diograph | null;
  focusId: string;
  storyId: string;
  prev: string;
  next: string;
  focus: {
    content: { contentUrl: string };
    image: string;
    geo: string;
    date: string;
    linked: string[];
  };
  relatedGeo: string[];
  relatedTime: string[];
  relatedStories: string[];
  delete?: () => void;
  link?: () => void;
  edit?: () => void;
}

export const getDioryInfo = (diographJson: IDiographObject): DioryInfo => {
  return {
    diograph: new Diograph(diographJson),
    focusId: "focusId",
    storyId: "storyId",
    prev: "prev",
    next: "next",
    focus: {
      content: { contentUrl: "content" },
      image: "image",
      geo: "geo",
      date: "date",
      linked: ["linked"],
    },
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

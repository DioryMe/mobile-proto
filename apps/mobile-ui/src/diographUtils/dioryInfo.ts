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

  const stories = Object.values(diograph.toObject())
    .filter((dioryData) => dioryData.links?.some((link) => link.id === focusId))
    .map((dioryData) => dioryData.id);

  const storyDioryId = storyId || stories[0] || null;

  let prev = null;
  let next = null;
  if (storyDioryId) {
    const storyDiory = diograph.getDiory({ id: storyDioryId });

    const focusDioryIndexInStory =
      storyDiory.links?.findIndex((link) => link.id === focusId) ?? -1;

    const prevTargetIndex = focusDioryIndexInStory - 1;
    const nextTargetIndex = focusDioryIndexInStory + 1;

    const prevDisabled =
      !storyDiory.links ||
      prevTargetIndex < 0 ||
      prevTargetIndex >= storyDiory.links.length;

    const nextDisabled =
      !storyDiory.links ||
      nextTargetIndex < 0 ||
      nextTargetIndex >= storyDiory.links.length;

    prev = prevDisabled ? null : storyDiory.links![prevTargetIndex].id;
    next = nextDisabled ? null : storyDiory.links![nextTargetIndex].id;
  }

  return {
    diograph: new Diograph(diographJson),
    focusId: focusDiory.id,
    storyId: storyDioryId,
    stories: stories,
    prev,
    next,
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

import { Diograph } from "@diograph/diograph";
import { IDiographObject } from "@diograph/diograph/types";

export interface DioryInfo {
  diograph: Diograph | null;
}

export const getDioryInfo = (diographJson: IDiographObject): DioryInfo => {
  return {
    diograph: new Diograph(diographJson),
  };
};

import { ButtonStyle } from "../components/Button";

export type ToolbarAction = {
  id: string;
  title: string;
  style?: ButtonStyle;
  enabled?: boolean;
  onClick: () => void;
};

export type ToolbarModel = {
  actions: ToolbarAction[];
};

export type OnToolbarChange = (model: ToolbarModel) => void;
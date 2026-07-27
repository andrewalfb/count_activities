import { ButtonStyle } from "../components/Button";

export enum Menu {
  main = 0,
  edit,
  add,
  statistics
};

 type Actions = {
  id: string;
  title: string;
  style?: ButtonStyle;
  enabled?: boolean;
  onClick: () => void;
};

export class TopMenu {
  menu: Menu
  actions: Actions[]
  
  constructor(menu: Menu, actions: Actions[] ) {
    this.menu = menu;
    this.actions = actions;
  }
}
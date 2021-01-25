import * as monaco from "monaco-editor";
import {EntityType} from "providers/Project";
import {CadenceSyntaxError, Highlight} from "../../util/language-syntax-errors";

export type InteractionButtonProps = {
  onClick: () => void,
  active?: boolean,
  type: EntityType
}

export type Argument = {
  name: string,
  type: string
}

export type ArgumentsProps = {
  type: EntityType;
  list: Argument[];
  signers: number;
  syntaxErrors: CadenceSyntaxError[];
  goTo: (position: monaco.IPosition) => void;
  hover: (highlight: Highlight) => void;
  hideDecorations: () => void;
};

export type ArgumentsTitleProps = {
  type: EntityType,
  expanded: boolean,
  setExpanded: (value: boolean) => void,
  errors?: number
}

export type ArgumentsListProps = {
  list: Argument[],
  hidden: boolean,
  onChange: (name: String, value: any) => void,
  errors: any,
}

export type ErrorListProps = {
  list: CadenceSyntaxError[],
  goTo: (position: monaco.IPosition) => void;
  hover: (highlight: Highlight) => void;
  hideDecorations: () => void;
}

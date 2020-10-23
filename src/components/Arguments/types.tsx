import {EntityType} from "providers/Project";

export type Argument = {
  name: string,
  type: string
}

export type InteractionButtonProps = {
  onClick: () => void,
  active?: boolean,
  type: EntityType
}

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


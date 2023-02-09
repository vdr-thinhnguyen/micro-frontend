export interface IButton {
  children: string;
  disabled: boolean;
  className?: string;
  onClick?: (event?: MouseEvent) => void;
}

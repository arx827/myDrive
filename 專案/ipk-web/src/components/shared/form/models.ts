export interface FblSubmitEvent<V, I> {
  value: V;
  isEditing: boolean;
  initData: I;
  formVisible?: boolean;
}

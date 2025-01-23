export function isActionChecked(action: string, array: { value: string; checked: boolean }[]): boolean {
  if (array) {
    for (const item of array) {
      if (item.value === action && item.checked) {
        return true;
      }
    }
  } else {
    return true
  }
  alert("You do no have the permission for" + action)
  return false;
}

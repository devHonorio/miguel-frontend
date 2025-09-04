import debounce from "debounce";
export const sleep500ms = debounce((fun: () => void) => {
  fun();
}, 500);

import React from "react";

/**
 * 포커스 커스텀 훅
 * @example
 * const { isFocus } = useFocus();
 */
export const useFocus = (
  defaultValue = true
): {
  /**
   * 윈도우 포커스 상태
   */
  isFocus: boolean;
} => {
  // state
  const [isFocus, setIsFocus] = React.useState(true);

  React.useEffect(() => {
    // 포커스 상태일 때 상태 true
    const onFocus = () => setIsFocus(true);
    // 블러 상태일 때 상태 false
    const onBlur = () => setIsFocus(false);

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return { isFocus };
};

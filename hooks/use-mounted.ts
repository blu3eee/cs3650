import * as React from "react";

/**
 * React hook to check if the component is mounted
 * @returns A boolean indicating if the component is mounted
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

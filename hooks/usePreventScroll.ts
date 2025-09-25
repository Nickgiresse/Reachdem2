import { useEffect } from "react"

type UsePreventScrollOptions = {
  isDisabled?: boolean
}

export function usePreventScroll({ isDisabled = false }: UsePreventScrollOptions) {
  useEffect(() => {
    if (isDisabled) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isDisabled])
}



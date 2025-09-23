"use client"

import * as React from "react"

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "checked"> & {
  checked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean) => void
}

export function Checkbox({ checked, onCheckedChange, className, ...props }: CheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = checked === "indeterminate"
    }
  }, [checked])

  return (
    <input
      ref={ref}
      type="checkbox"
      className={className}
      checked={checked === true}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  )
}



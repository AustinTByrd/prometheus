import { cn } from "cn"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      data-slot="spinner"
      fill="none"
      role="status"
      viewBox="0 0 16 16"
      {...props}
    >
      <circle
        cx="8"
        cy="8"
        opacity="0.25"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export { Spinner }

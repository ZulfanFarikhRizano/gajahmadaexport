"use client"

import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react"
import { cn } from "@/lib/utils"

const cardVariants = cva("absolute top-0 left-0 w-full h-full will-change-transform", {
  variants: {
    variant: {
      dark: "flex flex-col items-center justify-center gap-6 rounded-2xl border border-stone-700/50 bg-accent-foreground/80 p-6 backdrop-blur-md",
      light:
        "flex flex-col items-center justify-center gap-6 rounded-2xl border bg-background/80 p-6 backdrop-blur-md",
    },
  },
  defaultVariants: {
    variant: "light",
  },
})

interface ReviewProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number
  maxRating?: number
}

interface CardStickyProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof cardVariants> {
  arrayLength: number
  index: number
  incrementY?: number
  incrementZ?: number
  incrementRotation?: number
}

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined)

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (context === undefined) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScrollContextProvider"
    )
  }
  return context
}

export const ContainerScroll: React.FC<React.HTMLAttributes<HTMLDivElement>> = React.memo(({
  children,
  style,
  className,
  ...props
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  })

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-[220vh] w-full", className)}
        style={{ perspective: "1000px", transformStyle: "preserve-3d", ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
})
ContainerScroll.displayName = "ContainerScroll"

export const CardsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = React.memo(({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("relative", className)}
      style={{ perspective: "1000px", transformStyle: "preserve-3d", ...props.style }}
      {...props}
    >
      {children}
    </div>
  )
})
CardsContainer.displayName = "CardsContainer"

export const CardTransformed = React.memo(
  React.forwardRef<HTMLDivElement, CardStickyProps>(
    (
      {
        arrayLength,
        index,
        incrementY = 8,
        incrementZ = 10,
        incrementRotation,
        className,
        variant,
        style,
        ...props
      },
      ref
    ) => {
      const { scrollYProgress } = useContainerScrollContext()

      // Preset rotasi awal untuk fanned stack effect
      const initialRotation = React.useMemo(() => {
        if (incrementRotation !== undefined) return incrementRotation
        const rotations = [-6, 5, -4, 6]
        return rotations[index % rotations.length] || (index - 1) * 5
      }, [incrementRotation, index])

      // Timing range untuk naik (Y) dan merotasi (Rotate)
      const start = index / arrayLength
      const end = (index + 1) / arrayLength
      const rangeY = React.useMemo(() => [start, end], [start, end])

      const prevStart = index === 0 ? 0 : (index - 1) / arrayLength
      const rangeRotate = React.useMemo(() => [prevStart, start], [prevStart, start])

      // Perhitungan posisi Y & Rotate yang langsung dihantam ke GPU Composite Layer
      const y = useTransform(scrollYProgress, rangeY, ["0%", "-160%"])
      const rotate = useTransform(
        scrollYProgress,
        index === 0 ? [0, start] : rangeRotate,
        [initialRotation, 0]
      )

      // Memasukkan translateY statis offset ke GPU transform langsung (bukan lewat top CSS)
      const baseOffsetY = index * incrementY
      const baseOffsetZ = (arrayLength - index) * incrementZ

      const transform = useMotionTemplate`translate3d(0, calc(${baseOffsetY}px + ${y}), ${baseOffsetZ}px) rotate(${rotate}deg)`

      return (
        <motion.div
          ref={ref}
          style={{
            transform,
            zIndex: arrayLength - index,
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            ...style,
          }}
          className={cn(cardVariants({ variant, className }))}
          {...props}
        />
      )
    }
  )
)
CardTransformed.displayName = "CardTransformed"

export const ReviewStars = React.memo(
  React.forwardRef<HTMLDivElement, ReviewProps>(
    ({ rating, maxRating = 5, className, ...props }, ref) => {
      const filledStars = Math.floor(rating)
      const fractionalPart = rating - filledStars
      const emptyStars = maxRating - filledStars - (fractionalPart > 0 ? 1 : 0)

      return (
        <div
          className={cn("flex items-center gap-1", className)}
          ref={ref}
          {...props}
        >
          <div className="flex items-center">
            {[...Array(filledStars)].map((_, i) => (
              <svg
                key={`f-${i}`}
                className="size-4 text-amber-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
            ))}
            {fractionalPart > 0 && (
              <svg
                className="size-4 text-amber-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <defs>
                  <linearGradient id="half">
                    <stop
                      offset={`${fractionalPart * 100}%`}
                      stopColor="currentColor"
                    />
                    <stop
                      offset={`${fractionalPart * 100}%`}
                      stopColor="rgb(209 213 219)"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
                  fill="url(#half)"
                />
              </svg>
            )}
            {[...Array(emptyStars)].map((_, i) => (
              <svg
                key={`e-${i}`}
                className="size-4 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
            ))}
          </div>
        </div>
      )
    }
  )
)
ReviewStars.displayName = "ReviewStars"
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"
import { th } from "react-day-picker/locale"

import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

const THAI_SHORT_WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"] as const

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  buttonVariant = "ghost",
  locale = th,
  formatters,
  components,
  startMonth,
  endMonth,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  const currentYear = new Date().getFullYear()
  const effectiveStartMonth = startMonth ?? new Date(currentYear - 10, 0, 1)
  const effectiveEndMonth = endMonth ?? new Date(currentYear + 5, 11, 31)

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "shadcn-calendar group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(9)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      startMonth={effectiveStartMonth}
      endMonth={effectiveEndMonth}
      formatters={{
        formatCaption: (month) => {
          const monthName = month.toLocaleDateString("th-TH", { month: "long" })
          const buddhistYear = month.getFullYear() + 543
          return `${monthName} ${buddhistYear}`
        },
        formatYearDropdown: (year) => {
          return String(year.getFullYear() + 543)
        },
        formatMonthDropdown: (date) =>
          date.toLocaleDateString("th-TH", { month: "short" }),
        formatWeekdayName: (day) => {
          return THAI_SHORT_WEEKDAYS[day.getDay()] ?? ""
        },
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-3 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          "size-8 p-0 rounded-full select-none text-slate-600 hover:bg-emerald-100 hover:text-emerald-800 transition-colors flex items-center justify-center cursor-pointer border-0 bg-transparent dark:text-slate-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "size-8 p-0 rounded-full select-none text-slate-600 hover:bg-emerald-100 hover:text-emerald-800 transition-colors flex items-center justify-center cursor-pointer border-0 bg-transparent dark:text-slate-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-8 w-full items-center justify-center px-8",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-8 items-center justify-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-full px-2.5 py-0.5 hover:bg-emerald-100/70 hover:text-emerald-800 transition-colors cursor-pointer dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0 cursor-pointer",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-semibold select-none text-slate-800 dark:text-slate-100 flex items-center gap-1 rounded-full px-2 py-0.5 hover:bg-emerald-100/70 text-sm [&>svg]:size-3.5 [&>svg]:text-[#00A651]",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-fit border-collapse", defaultClassNames.month_grid),
        weekdays: cn(
          "flex items-center justify-center bg-emerald-50/90 dark:bg-emerald-950/40 rounded-xl p-0.5 mb-1.5",
          defaultClassNames.weekdays
        ),
        weekday: cn(
          "w-9 h-9 p-0 flex items-center justify-center text-center font-semibold text-xs select-none rounded-lg text-emerald-800 dark:text-emerald-300 first:bg-rose-100/70 first:text-rose-600 dark:first:bg-rose-950/50 dark:first:text-rose-400 last:bg-purple-100/70 last:text-purple-600 dark:last:bg-purple-950/50 dark:last:text-purple-400",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full items-center justify-center mt-0.5", defaultClassNames.week),
        week_number_header: cn(
          "w-9 select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "w-9 h-9 p-0 flex items-center justify-center text-center relative select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-xl bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-xl bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
          defaultClassNames.range_end
        ),
        today: cn(
          "font-bold text-emerald-800",
          defaultClassNames.today
        ),
        outside: cn(
          "text-slate-300 opacity-30 pointer-events-none aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-40 pointer-events-none",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn("shadcn-calendar", className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4", className)} {...props} />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-9 items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const dayOfWeek = day.date.getDay()
  const isSunday = dayOfWeek === 0
  const isSaturday = dayOfWeek === 6
  const isSelected = modifiers.selected
  const isToday = modifiers.today
  const isOutside = modifiers.outside

  let dayStyle =
    "text-slate-700 hover:bg-emerald-100/80 hover:text-emerald-800 dark:text-slate-200 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"

  if (isSelected) {
    dayStyle = "!bg-[#00A651] !text-white hover:!bg-[#008f44] font-semibold shadow-sm"
  } else if (isToday) {
    dayStyle =
      "bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 hover:bg-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/60"
  } else if (isOutside) {
    dayStyle =
      "text-slate-300 opacity-30 hover:bg-transparent pointer-events-none dark:text-slate-600"
  } else if (isSunday) {
    dayStyle =
      "bg-rose-50/70 text-rose-600 hover:bg-emerald-100 hover:text-emerald-800 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
  } else if (isSaturday) {
    dayStyle =
      "bg-purple-50/70 text-purple-600 hover:bg-emerald-100 hover:text-emerald-800 dark:bg-purple-950/30 dark:text-purple-400 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
  }

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 size-9 p-0 rounded-xl text-xs font-medium transition-all duration-150 flex items-center justify-center select-none outline-none",
        dayStyle,
        modifiers.range_start && "!bg-[#00A651] !text-white rounded-l-xl rounded-r-none",
        modifiers.range_end && "!bg-[#00A651] !text-white rounded-r-xl rounded-l-none",
        modifiers.range_middle && "!bg-emerald-50 !text-emerald-900 rounded-none dark:!bg-emerald-950/50 dark:!text-emerald-200",
        defaultClassNames.day_button,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }

"use client";

import { DateRange } from "react-day-picker";
import { CalendarDateRangePicker } from "./date-range-picker";

export function DateRangePicker({
  range,
  setRange,
}: {
  range: DateRange;
  setRange: (range: DateRange) => void;
}) {
  return <CalendarDateRangePicker date={range} setDate={setRange} />;
}

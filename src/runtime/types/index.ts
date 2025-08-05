export interface Reservation {
  id: string
  title: string
  start_date: string
  end_date: string
  duration: number
  amount?: number
  phone?: string
}

export interface WorkingHours {
  morning: number[]
  afternoon: number[]
}

export interface CalendarDate {
  year: number
  month: number
  day: number
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isDisabled?: boolean
  events?: CalendarEvent[]
}

export interface CalendarEvent {
  id: string | number
  title: string
  description?: string
  date: Date
  startTime?: string
  endTime?: string
  color?: string
  category?: string
  allDay?: boolean
}

export interface CalendarConfig {
  locale: string
  firstDayOfWeek: number
  showWeekNumbers: boolean
  theme: 'light' | 'dark' | 'auto'
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  format?: {
    monthYear?: string
    dayOfWeek?: string
    date?: string
  }
}

export interface CalendarEmits {
  'reservation-click': [reservation: Reservation]
  'view-change': [view: 'day' | 'week', date: Date]
  'date-change': [date: Date]
  'new-reservation': [reservation: Reservation]
  'reservations-updated': [reservations: Reservation[]]
}

export interface GenericCalendarEmits {
  'date-select': [date: CalendarDate]
  'month-change': [month: number, year: number]
  'year-change': [year: number]
  'event-click': [event: CalendarEvent]
}

export type CalendarView = 'month' | 'week' | 'day'
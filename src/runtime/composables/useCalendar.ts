import { ref, computed, reactive } from 'vue'
import type { CalendarDate, CalendarEvent, CalendarConfig } from '../types'

export function useCalendar(config?: Partial<CalendarConfig>) {
  const defaultConfig = useRuntimeConfig().public.calendar
  const calendarConfig = reactive({
    ...defaultConfig,
    ...config
  })

  const currentDate = ref(new Date())
  const selectedDate = ref<Date | null>(null)
  const events = ref<CalendarEvent[]>([])

  const currentMonth = computed(() => currentDate.value.getMonth())
  const currentYear = computed(() => currentDate.value.getFullYear())
  
  const monthName = computed(() => {
    return new Intl.DateTimeFormat(calendarConfig.locale, { 
      month: 'long' 
    }).format(currentDate.value)
  })

  const weekDays = computed(() => {
    const days = []
    const date = new Date()
    const startDay = calendarConfig.firstDayOfWeek
    
    for (let i = 0; i < 7; i++) {
      const dayIndex = (startDay + i) % 7
      date.setDate(date.getDate() - date.getDay() + dayIndex)
      days.push(
        new Intl.DateTimeFormat(calendarConfig.locale, { 
          weekday: 'short' 
        }).format(date)
      )
    }
    return days
  })

  const calendarDates = computed((): CalendarDate[] => {
    const dates: CalendarDate[] = []
    const firstDay = new Date(currentYear.value, currentMonth.value, 1)
    const today = new Date()
    
    const startDate = new Date(firstDay)
    const firstDayOfWeek = calendarConfig.firstDayOfWeek
    while (startDate.getDay() !== firstDayOfWeek) {
      startDate.setDate(startDate.getDate() - 1)
    }
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const isCurrentMonth = date.getMonth() === currentMonth.value
      const isToday = isSameDay(date, today)
      const isSelected = selectedDate.value ? isSameDay(date, selectedDate.value) : false
      const isDisabled = isDateDisabled(date)
      
      dates.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        date: new Date(date),
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled,
        events: getEventsForDate(date)
      })
    }
    
    return dates
  })

  function goToNextMonth() {
    currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
  }

  function goToPreviousMonth() {
    currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
  }

  function goToToday() {
    currentDate.value = new Date()
  }

  function selectDate(date: Date) {
    if (!isDateDisabled(date)) {
      selectedDate.value = date
    }
  }

  function addEvent(event: CalendarEvent) {
    events.value.push(event)
  }

  function removeEvent(eventId: string | number) {
    const index = events.value.findIndex(event => event.id === eventId)
    if (index > -1) {
      events.value.splice(index, 1)
    }
  }

  function getEventsForDate(date: Date): CalendarEvent[] {
    return events.value.filter(event => 
      isSameDay(event.date, date)
    )
  }

  function isDateDisabled(date: Date): boolean {
    if (calendarConfig.minDate && date < calendarConfig.minDate) {
      return true
    }
    if (calendarConfig.maxDate && date > calendarConfig.maxDate) {
      return true
    }
    if (calendarConfig.disabledDates) {
      return calendarConfig.disabledDates.some(disabledDate => 
        isSameDay(date, disabledDate)
      )
    }
    return false
  }

  function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  }

  function formatDate(date: Date, format?: string): string {
    if (format) {
      return new Intl.DateTimeFormat(calendarConfig.locale, {
        dateStyle: format as any
      }).format(date)
    }
    return new Intl.DateTimeFormat(calendarConfig.locale).format(date)
  }

  return {
    currentDate: readonly(currentDate),
    selectedDate: readonly(selectedDate),
    events: readonly(events),
    config: readonly(calendarConfig),
    
    currentMonth,
    currentYear,
    monthName,
    weekDays,
    calendarDates,
    
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    selectDate,
    addEvent,
    removeEvent,
    getEventsForDate,
    isDateDisabled,
    formatDate
  }
}
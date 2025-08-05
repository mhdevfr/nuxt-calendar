import { ref, computed, reactive } from 'vue'
import type { Reservation, WorkingHours } from '../types'

export function useReservationCalendar(config?: {
  locale?: string
  timezone?: string
  workingHours?: WorkingHours
}) {
  const runtimeConfig = useRuntimeConfig()
  const defaultConfig = runtimeConfig.public.calendar
  
  const calendarConfig = reactive({
    locale: config?.locale || defaultConfig.locale || 'fr-FR',
    timezone: config?.timezone || defaultConfig.timezone || 'Europe/Paris',
    workingHours: config?.workingHours || defaultConfig.workingHours || {
      morning: [9, 10, 11, 12],
      afternoon: [14, 15, 16]
    }
  })

  const currentDate = ref(new Date())
  const currentView = ref<'day' | 'week'>('week')
  const reservations = ref<Reservation[]>([])
  const selectedReservation = ref<Reservation | null>(null)

  const currentYear = computed(() => currentDate.value.getFullYear())
  const currentMonth = computed(() => currentDate.value.getMonth())
  const currentDay = computed(() => currentDate.value.getDate())

  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const allHours = computed(() => [
    ...calendarConfig.workingHours.morning,
    ...calendarConfig.workingHours.afternoon
  ])

  const formattedCurrentDate = computed(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: calendarConfig.timezone
    }

    if (currentView.value === 'day') {
      return currentDate.value.toLocaleDateString(calendarConfig.locale, options)
    } else {
      const weekStart = getWeekStart(currentDate.value)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 5)
      
      return `Semaine du ${weekStart.toLocaleDateString(calendarConfig.locale, { 
        day: 'numeric', 
        month: 'long' 
      })} au ${weekEnd.toLocaleDateString(calendarConfig.locale, { 
        day: 'numeric', 
        month: 'long' 
      })}`
    }
  })

  function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  function getDateForWeekDay(dayIndex: number): Date {
    const weekStart = getWeekStart(currentDate.value)
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + dayIndex)
    return date
  }

  function formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString(calendarConfig.locale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: calendarConfig.timezone
    })
  }

  function formatDate(date: Date, format?: Intl.DateTimeFormatOptions): string {
    const defaultFormat: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      timeZone: calendarConfig.timezone
    }
    return date.toLocaleDateString(calendarConfig.locale, format || defaultFormat)
  }

  function addReservation(reservation: Reservation) {
    reservations.value.push(reservation)
  }

  function removeReservation(reservationId: string) {
    const index = reservations.value.findIndex(r => r.id === reservationId)
    if (index > -1) {
      reservations.value.splice(index, 1)
    }
  }

  function updateReservation(reservationId: string, updates: Partial<Reservation>) {
    const index = reservations.value.findIndex(r => r.id === reservationId)
    if (index > -1) {
      reservations.value[index] = { ...reservations.value[index], ...updates }
    }
  }

  function getReservationsForDate(date: Date): Reservation[] {
    return reservations.value.filter(reservation => {
      const reservationDate = new Date(reservation.start_date)
      return (
        reservationDate.getFullYear() === date.getFullYear() &&
        reservationDate.getMonth() === date.getMonth() &&
        reservationDate.getDate() === date.getDate()
      )
    })
  }

  function getReservationsForHour(hour: number, date?: Date): Reservation[] {
    const targetDate = date || currentDate.value
    return reservations.value.filter(reservation => {
      const reservationDate = new Date(reservation.start_date)
      const reservationHour = reservationDate.getHours()
      
      return (
        reservationDate.getFullYear() === targetDate.getFullYear() &&
        reservationDate.getMonth() === targetDate.getMonth() &&
        reservationDate.getDate() === targetDate.getDate() &&
        reservationHour === hour
      )
    })
  }

  function getReservationsForDayAndHour(dayIndex: number, hour: number): Reservation[] {
    const date = getDateForWeekDay(dayIndex)
    return getReservationsForHour(hour, date)
  }

  function goToNextDay() {
    const date = new Date(currentDate.value)
    date.setDate(date.getDate() + 1)
    currentDate.value = date
  }

  function goToPreviousDay() {
    const date = new Date(currentDate.value)
    date.setDate(date.getDate() - 1)
    currentDate.value = date
  }

  function goToNextWeek() {
    const date = new Date(currentDate.value)
    date.setDate(date.getDate() + 7)
    currentDate.value = date
  }

  function goToPreviousWeek() {
    const date = new Date(currentDate.value)
    date.setDate(date.getDate() - 7)
    currentDate.value = date
  }

  function navigateDate(direction: 'prev' | 'next') {
    if (currentView.value === 'day') {
      direction === 'next' ? goToNextDay() : goToPreviousDay()
    } else {
      direction === 'next' ? goToNextWeek() : goToPreviousWeek()
    }
  }

  function goToToday() {
    currentDate.value = new Date()
  }

  function changeView(view: 'day' | 'week') {
    currentView.value = view
    if (view === 'week') {
      currentDate.value = getWeekStart(currentDate.value)
    }
  }

  function getReservationStyle(reservation: Reservation, hour: number) {
    const start = new Date(reservation.start_date)
    const end = new Date(reservation.end_date)
    const startHour = start.getHours()
    const startMinutes = start.getMinutes()

    if (startHour === hour) {
      const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      
      return {
        height: `${Math.min(durationHours * 100, 100)}%`,
        top: `${(startMinutes / 60) * 100}%`,
        position: 'absolute',
        left: '0',
        right: '0',
        zIndex: 10
      }
    }
    
    return { display: 'none' }
  }

  return {
    currentDate: readonly(currentDate),
    currentView: readonly(currentView),
    reservations: readonly(reservations),
    selectedReservation: readonly(selectedReservation),
    config: readonly(calendarConfig),
    
    currentYear,
    currentMonth,
    currentDay,
    weekDays,
    allHours,
    formattedCurrentDate,

    navigateDate,
    goToNextDay,
    goToPreviousDay,
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
    changeView,
    
    addReservation,
    removeReservation,
    updateReservation,
    getReservationsForDate,
    getReservationsForHour,
    getReservationsForDayAndHour,
    
    getDateForWeekDay,
    formatTime,
    formatDate,
    getReservationStyle,
    
    setSelectedReservation: (reservation: Reservation | null) => {
      selectedReservation.value = reservation
    },
    setReservations: (newReservations: Reservation[]) => {
      reservations.value = newReservations
    }
  }
}
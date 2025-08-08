import { describe, it, expect } from 'vitest'
import { useCalendar } from '../src/runtime/composables/useCalendar'
import { useReservationCalendar } from '../src/runtime/composables/useReservationCalendar'

describe('useCalendar', () => {
  it('initializes with default locale and computes month', () => {
    const calendar = useCalendar({ locale: 'fr-FR' })
    expect(calendar.currentMonth.value).toBeTypeOf('number')
    expect(calendar.currentYear.value).toBeTypeOf('number')
    expect(Array.isArray(calendar.weekDays.value)).toBe(true)
    expect(calendar.weekDays.value.length).toBe(7)
  })

  it('navigates months', () => {
    const calendar = useCalendar()
    const initialMonth = calendar.currentMonth.value
    calendar.goToNextMonth()
    expect(calendar.currentMonth.value).toBe((initialMonth + 1) % 12)
    calendar.goToPreviousMonth()
    expect(calendar.currentMonth.value).toBe(initialMonth)
  })

  it('selects a date and adds events', () => {
    const calendar = useCalendar()
    const today = new Date()
    calendar.selectDate(today)
    expect(calendar.selectedDate.value?.getDate()).toBe(today.getDate())

    calendar.addEvent({ id: '1', title: 'Test', date: today })
    const events = calendar.getEventsForDate(today)
    expect(events.length).toBe(1)
    expect(events[0].title).toBe('Test')
  })
})

describe('useReservationCalendar', () => {
  it('initializes and formats current date', () => {
    const r = useReservationCalendar({ locale: 'fr-FR', timezone: 'Europe/Paris' })
    expect(r.currentDay.value).toBeTypeOf('number')
    expect(r.formattedCurrentDate.value).toBeTypeOf('string')
  })

  it('navigates week and day views', () => {
    const r = useReservationCalendar()
    const initialDate = r.currentDate.value.getTime()
    r.goToNextWeek()
    expect(r.currentDate.value.getTime()).toBeGreaterThan(initialDate)
    r.goToPreviousWeek()
    expect(r.currentDate.value.getTime()).toBe(initialDate)
  })

  it('manages reservations', () => {
    const r = useReservationCalendar()
    const start = new Date()
    const end = new Date(start.getTime() + 60 * 60 * 1000)
    r.addReservation({ id: 'r1', title: 'Res', start_date: start.toISOString(), end_date: end.toISOString(), duration: 60 })
    expect(r.reservations.value.length).toBe(1)
    r.updateReservation('r1', { title: 'Res2' })
    expect(r.reservations.value[0].title).toBe('Res2')
    r.removeReservation('r1')
    expect(r.reservations.value.length).toBe(0)
  })
})



import { describe, it, expect } from 'vitest'
import { useCalendar } from '../src/runtime/composables/useCalendar'
import { useReservationCalendar } from '../src/runtime/composables/useReservationCalendar'

describe('useCalendar Composable', () => {
  it('initializes with default config', () => {
    const calendar = useCalendar()
    
    expect(calendar.currentDate.value).toBeInstanceOf(Date)
    expect(calendar.selectedDate.value).toBeDefined()
    expect(calendar.events.value).toEqual([])
    expect(calendar.config.locale).toBe('fr-FR')
  })

  it('accepts custom config', () => {
    const calendar = useCalendar({
      locale: 'en-US',
      firstDayOfWeek: 0,
      showWeekNumbers: true
    })
    
    expect(calendar.config.locale).toBe('en-US')
    expect(calendar.config.firstDayOfWeek).toBe(0)
    expect(calendar.config.showWeekNumbers).toBe(true)
  })

  it('provides week days in correct order', () => {
    const calendar = useCalendar({ firstDayOfWeek: 1 })
    
    expect(calendar.weekDays.value).toHaveLength(7)
    expect(calendar.weekDays.value).toBeDefined()
  })

  it('adds events correctly', () => {
    const calendar = useCalendar()
    const event = { id: '1', title: 'Test', date: new Date() }
    
    calendar.addEvent(event)
    
    expect(calendar.events.value).toHaveLength(1)
    expect(calendar.events.value[0]).toEqual(event)
  })

  it('navigates to previous month', () => {
    const calendar = useCalendar()
    const initialMonth = calendar.currentDate.value.getMonth()
    
    calendar.goToPreviousMonth()
    
    expect(calendar.currentDate.value.getMonth()).toBe(initialMonth === 0 ? 11 : initialMonth - 1)
  })

  it('navigates to next month', () => {
    const calendar = useCalendar()
    const initialMonth = calendar.currentDate.value.getMonth()
    
    calendar.goToNextMonth()
    
    expect(calendar.currentDate.value.getMonth()).toBe(initialMonth === 11 ? 0 : initialMonth + 1)
  })
})

describe('useReservationCalendar Composable', () => {
  it('initializes with default config', () => {
    const calendar = useReservationCalendar()
    
    expect(calendar.currentDate.value).toBeInstanceOf(Date)
    expect(calendar.currentView.value).toBe('week')
    expect(calendar.reservations.value).toEqual([])
    expect(calendar.config.locale).toBe('fr-FR')
  })

  it('accepts custom config', () => {
    const calendar = useReservationCalendar({
      locale: 'en-US',
      timezone: 'America/New_York',
      workingHours: {
        morning: [8, 9, 10],
        afternoon: [13, 14, 15]
      }
    })
    
    expect(calendar.config.locale).toBe('en-US')
    expect(calendar.config.timezone).toBe('America/New_York')
    expect(calendar.config.workingHours.morning).toEqual([8, 9, 10])
  })

  it('adds reservations correctly', () => {
    const calendar = useReservationCalendar()
    const reservation = {
      id: '1',
      title: 'Test Reservation',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 3600000).toISOString(),
      duration: 60,
      amount: 100,
      phone: '+33123456789'
    }
    
    calendar.addReservation(reservation)
    
    expect(calendar.reservations.value).toHaveLength(1)
    expect(calendar.reservations.value[0]).toEqual(reservation)
  })

  it('filters reservations by date range', () => {
    const calendar = useReservationCalendar()
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    const reservation1 = {
      id: '1',
      title: 'Today',
      start_date: today.toISOString(),
      end_date: new Date(today.getTime() + 3600000).toISOString(),
      duration: 60,
      amount: 100,
      phone: '+33123456789'
    }
    
    const reservation2 = {
      id: '2',
      title: 'Tomorrow',
      start_date: tomorrow.toISOString(),
      end_date: new Date(tomorrow.getTime() + 3600000).toISOString(),
      duration: 60,
      amount: 100,
      phone: '+33123456789'
    }
    
    calendar.addReservation(reservation1)
    calendar.addReservation(reservation2)
    
    const filtered = calendar.getReservationsForDate(today)
    expect(filtered).toHaveLength(1)
    expect(filtered[0].title).toBe('Today')
  })

  it('changes view correctly', () => {
    const calendar = useReservationCalendar()
    
    calendar.changeView('day')
    expect(calendar.currentView.value).toBe('day')
    
    calendar.changeView('week')
    expect(calendar.currentView.value).toBe('week')
  })
}) 
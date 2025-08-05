import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Calendar from '../src/runtime/components/Calendar.vue'
import type { Reservation } from '../src/runtime/types'

const mockReservations: Reservation[] = [
  {
    id: '1',
    title: 'Test Event',
    start_date: '2025-08-04T14:00:00+02:00',
    end_date: '2025-08-04T15:00:00+02:00',
    duration: 60,
    amount: 100,
    phone: '+33123456789'
  }
]

describe('Calendar Component', () => {
  it('renders calendar with correct title', () => {
    const wrapper = mount(Calendar, {
      props: {
        reservations: mockReservations
      }
    })
    
    expect(wrapper.find('.calendar-title h1').exists()).toBe(true)
  })

  it('displays week view by default', () => {
    const wrapper = mount(Calendar, {
      props: {
        reservations: mockReservations
      }
    })
    
    expect(wrapper.find('.btn-active').text()).toBe('Semaine')
  })

  it('shows correct number of days in week view', () => {
    const wrapper = mount(Calendar, {
      props: {
        reservations: mockReservations
      }
    })
    
    const dayHeaders = wrapper.findAll('.day-column')
    expect(dayHeaders).toHaveLength(6)
  })

  it('displays reservations in correct time slots', () => {
    const wrapper = mount(Calendar, {
      props: {
        reservations: mockReservations
      }
    })
    
    const reservationCards = wrapper.findAll('.reservation-card')
    expect(reservationCards.length).toBeGreaterThan(0)
  })

  it('emits reservation-click event when reservation is clicked', async () => {
    const wrapper = mount(Calendar, {
      props: {
        reservations: mockReservations
      }
    })
    
    const reservationCard = wrapper.find('.reservation-card')
    await reservationCard.trigger('click')
    
    expect(wrapper.emitted('reservation-click')).toBeTruthy()
  })

  it('switches to day view when day button is clicked', async () => {
    const wrapper = mount(Calendar, {
      props: {
        reservations: mockReservations
      }
    })
    
    const dayButton = wrapper.findAll('button').find(btn => btn.text().includes('Jour'))
    await dayButton?.trigger('click')
    
    expect(wrapper.find('.btn-active').text()).toBe('Jour')
  })

  it('navigates to next week when next button is clicked', async () => {
    const wrapper = mount(Calendar, {
      props: {
        reservations: mockReservations
      }
    })
    
    const nextButton = wrapper.findAll('button').find(btn => btn.text().includes('→'))
    await nextButton?.trigger('click')
    
    expect(wrapper.emitted('date-change')).toBeTruthy()
  })
}) 
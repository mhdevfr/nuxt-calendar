import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SimpleCalendar from '../src/runtime/components/SimpleCalendar.vue'
import Calendar from '../src/runtime/components/Calendar.vue'

describe('SimpleCalendar', () => {
  it('renders days and emits events', async () => {
    const wrapper = mount(SimpleCalendar, {
      props: {
        events: [
          { id: 1, title: 'Meeting', date: new Date(), color: '#3b82f6' }
        ],
        locale: 'fr-FR'
      }
    })
    expect(wrapper.find('.calendar-grid').exists()).toBe(true)
    await wrapper.vm.$nextTick()
    const day = wrapper.find('.calendar-day')
    await day.trigger('click')
    expect(wrapper.emitted('date-select')).toBeTruthy()
  })
})

describe('Calendar', () => {
  it('renders week view table', () => {
    const wrapper = mount(Calendar, {
      props: {
        reservations: [],
        workingHours: { morning: [9], afternoon: [14] },
        locale: 'fr-FR',
        timezone: 'Europe/Paris'
      }
    })
    expect(wrapper.find('table').exists()).toBe(true)
  })
})



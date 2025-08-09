import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ReservationModal from '../src/runtime/components/ReservationModal.vue'
import AddReservationModal from '../src/runtime/components/AddReservationModal.vue'

describe('ReservationModal', () => {
  const reservation = {
    id: 'r1',
    title: 'VIP Meeting',
    start_date: '2025-08-04T09:00:00',
    end_date: '2025-08-04T10:00:00',
    duration: 60,
    amount: 120,
    phone: '+33123456789'
  }

  it('renders details when visible', () => {
    const wrapper = mount(ReservationModal, {
      props: { visible: true, reservation, locale: 'en-US' }
    })
    expect(wrapper.text()).toContain('Reservation details')
    expect(wrapper.text()).toContain('VIP Meeting')
  })

  it('emits close on close button and overlay click', async () => {
    const wrapper = mount(ReservationModal, {
      props: { visible: true, reservation }
    })
    await wrapper.find('.modal-close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()

    await wrapper.setProps({ visible: true })
    await wrapper.find('.modal-overlay').trigger('click')
    expect(wrapper.emitted('close')!.length).toBeGreaterThan(0)
  })
})

describe('AddReservationModal', () => {
  it('computes duration from start/end times and emits payload', async () => {
    const wrapper = mount(AddReservationModal, { props: { visible: true } })

    const dateInput = wrapper.find('input[type="date"]')
    const timeInputs = wrapper.findAll('input[type="time"]')
    expect(timeInputs.length).toBeGreaterThanOrEqual(2)

    // fill title
    const titleInput = wrapper.find('input[type="text"]')
    await titleInput.setValue('New Reservation')
    await dateInput.setValue('2025-08-04')
    await timeInputs[0].setValue('09:00') // start
    await timeInputs[1].setValue('10:30') // end

    await wrapper.find('form').trigger('submit.prevent')

    const submitEvents = wrapper.emitted('submit')
    expect(submitEvents).toBeTruthy()
    const payload = submitEvents![0][0]
    expect(payload.title).toBe('New Reservation')
    expect(payload.duration).toBe(90)
    // Be robust to timezone by comparing on Date objects
    const start = new Date(payload.start_date)
    const end = new Date(payload.end_date)
    // same day
    expect(start.toISOString().startsWith('2025-08-04')).toBe(true)
    expect(end.toISOString().startsWith('2025-08-04')).toBe(true)
    // 90 minutes apart
    expect(Math.round((end.getTime() - start.getTime()) / 60000)).toBe(90)
  })

  it('disables Add when end <= start and shows error', async () => {
    const wrapper = mount(AddReservationModal, { props: { visible: true } })
    const dateInput = wrapper.find('input[type="date"]')
    const timeInputs = wrapper.findAll('input[type="time"]')

    await dateInput.setValue('2025-08-04')
    await timeInputs[0].setValue('10:00') // start
    await timeInputs[1].setValue('09:00') // end invalid

    const addBtn = wrapper.find('button[type="submit"]')
    expect(addBtn.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('End time must be after start time')
  })
})



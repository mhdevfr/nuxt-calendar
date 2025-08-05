<template>
  <Calendar 
    v-bind="$attrs"
    :reservations="reservations"
    :working-hours="workingHours"
    :is-mobile="isMobile"
    :locale="locale"
    :timezone="timezone"
    :theme="theme"
    @reservation-click="(reservation) => emit('reservation-click', reservation)"
    @view-change="(view, date) => emit('view-change', view, date)"
    @date-change="(date) => emit('date-change', date)"
    @new-reservation="(reservation) => emit('new-reservation', reservation)"
    @reservations-updated="(reservations) => emit('reservations-updated', reservations)"
  />
</template>

<script setup lang="ts">
import type { Reservation, WorkingHours } from '../types'
import Calendar from './Calendar.vue'

interface Props {
  locale?: string
  timezone?: string  
  theme?: 'light' | 'dark' | 'auto'
  reservations?: Reservation[]
  workingHours?: WorkingHours
  isMobile?: boolean
}

withDefaults(defineProps<Props>(), {
  locale: 'fr-FR',
  timezone: 'Europe/Paris',
  theme: 'auto',
  reservations: () => [],
  workingHours: () => ({ 
    morning: [9, 10, 11, 12], 
    afternoon: [14, 15, 16] 
  }),
  isMobile: false
})

const emit = defineEmits<{
  'reservation-click': [reservation: Reservation]
  'view-change': [view: 'day' | 'week', date: Date]
  'date-change': [date: Date]
  'new-reservation': [reservation: Reservation]
  'reservations-updated': [reservations: Reservation[]]
}>()
</script>
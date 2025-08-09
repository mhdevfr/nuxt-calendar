<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <div class="calendar-title">
        <h1>{{ formatCurrentDate }}</h1>
      </div>
      <div class="calendar-controls">
        <button 
          class="btn"
          :class="{ 'btn-active': currentView === 'day' }"
          @click="changeView('day')"
        >
          <span class="btn-text">Jour</span>
        </button>
        <button 
          class="btn"
          :class="{ 'btn-active': currentView === 'week' }"
          @click="changeView('week')"
        >
          <span class="btn-text">Semaine</span>
        </button>
        <button class="btn" @click="navigateDate('prev')">
          <span class="btn-text">←</span>
        </button>
        <button class="btn" @click="navigateDate('next')">
          <span class="btn-text">→</span>
        </button>
      </div>
    </div>

    <div class="calendar-content">
      <div class="calendar-grid">
        <table class="calendar-table">
          <thead>
            <tr>
              <th class="time-column">Heure</th>
              <th v-if="currentView === 'day'" class="day-column">
                {{ formatDayHeader(currentDate) }}
              </th>
              <th v-else v-for="(day, index) in days" :key="day" class="day-column">
                <div class="day-name">{{ day }}</div>
                <div class="day-date">{{ formatDayDate(getDateForDay(index)) }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hour in hours" :key="hour">
              <td class="time-cell">
                {{ String(hour).padStart(2, '0') }}:00
              </td>
              <td v-if="currentView === 'day'" class="calendar-cell">
                <div
                  v-for="reservation in getReservationsForHour(hour)"
                  :key="reservation.id"
                  class="reservation-card"
                  :style="getReservationStyle(reservation, hour)"
                  @click="handleReservationClick(reservation)"
                >
                  <div class="reservation-content">
                    <p class="reservation-title">{{ reservation.title }}</p>
                    <p class="reservation-time">{{ formatTime(reservation.start_date) }}</p>
                  </div>
                </div>
              </td>
              <td v-else v-for="(day, index) in days" :key="`${day}-${hour}`" class="calendar-cell">
                <div
                  v-for="reservation in getReservationsForDayAndHour(index, hour)"
                  :key="reservation.id"
                  class="reservation-card"
                  :style="getReservationStyle(reservation, hour)"
                  @click="handleReservationClick(reservation)"
                >
                  <div class="reservation-content">
                    <p class="reservation-title">{{ reservation.title }}</p>
                    <p class="reservation-time">{{ formatTime(reservation.start_date) }}</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Reservation, WorkingHours } from '../types'

interface Props {
  reservations?: Reservation[]
  workingHours?: WorkingHours
  isMobile?: boolean
  locale?: string
  timezone?: string
  theme?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  reservations: () => [],
  workingHours: () => ({ 
    morning: [9, 10, 11, 12], 
    afternoon: [14, 15, 16] 
  }),
  isMobile: false,
  locale: 'fr-FR',
  timezone: 'Europe/Paris',
  theme: 'auto'
})

const emit = defineEmits<{
  'reservation-click': [reservation: Reservation]
  'view-change': [view: 'day' | 'week', date: Date]
  'date-change': [date: Date]
  'new-reservation': [reservation: Reservation]
  'reservations-updated': [reservations: Reservation[]]
}>()

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hours = [...props.workingHours.morning, ...props.workingHours.afternoon]
const currentView = ref<'day' | 'week'>(props.isMobile ? 'day' : 'week')
const currentDate = ref(new Date('2025-08-04'))

const formatCurrentDate = computed(() => {
  const date = currentDate.value
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  if (currentView.value === 'day') {
    return date.toLocaleDateString(props.locale, options)
  } else {
    const weekStart = getWeekStart(currentDate.value)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 5)
    return `Semaine du ${weekStart.toLocaleDateString(props.locale, { 
      day: 'numeric', 
      month: 'long' 
    })} au ${weekEnd.toLocaleDateString(props.locale, { 
      day: 'numeric', 
      month: 'long' 
    })}`
  }
})

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()

  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const weekStart = new Date(d)
  weekStart.setDate(diff)
  return weekStart
}

function formatDayHeader(date: Date): string {
  return date.toLocaleDateString(props.locale, { 
    weekday: 'long',
    day: 'numeric'
  })
}

function formatDayDate(date: Date): string {
  return date.toLocaleDateString(props.locale, {
    day: 'numeric',
    month: 'short'
  })
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString(props.locale, {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getDateForDay(dayIndex: number): Date {
  const weekStart = getWeekStart(currentDate.value)
  const date = new Date(weekStart)
  date.setDate(weekStart.getDate() + dayIndex)
  return date
}

function getReservationsForHour(hour: number): Reservation[] {
  return props.reservations.filter(reservation => {
    const reservationDate = new Date(reservation.start_date)
    const reservationHour = reservationDate.getHours()
    const currentDay = currentDate.value.getDate()
    const reservationDay = reservationDate.getDate()
    
    return reservationDay === currentDay && reservationHour === hour
  })
}

function getReservationsForDayAndHour(dayIndex: number, hour: number): Reservation[] {
  const date = getDateForDay(dayIndex)
  const filtered = props.reservations.filter(reservation => {
    const reservationDate = new Date(reservation.start_date)
    const sameDay = 
      reservationDate.getFullYear() === date.getFullYear() &&
      reservationDate.getMonth() === date.getMonth() &&
      reservationDate.getDate() === date.getDate()
    const reservationHour = reservationDate.getHours()
        return sameDay && reservationHour === hour
  })
  return filtered
}

function getReservationStyle(reservation: Reservation, hour: number) {
  const start = new Date(reservation.start_date)
  const end = new Date(reservation.end_date)
  const startHour = start.getHours()
  const startMinutes = start.getMinutes()
  
  if (startHour === hour) {
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    
    return {
      height: `${Math.min(durationHours * 80, 80)}%`,
      top: `${(startMinutes / 60) * 100}%`,
      left: '2px',
      right: '2px',
      position: 'absolute' as const,
      zIndex: 10
    }
  }
  
  return { display: 'none' }
}

function handleReservationClick(reservation: Reservation) {
  emit('reservation-click', reservation)
}

function changeView(view: 'day' | 'week') {
  currentView.value = view
  if (view === 'week') {
    currentDate.value = getWeekStart(currentDate.value)
  }
  emit('view-change', view, currentDate.value)
}

function navigateDate(direction: 'prev' | 'next') {
  const date = new Date(currentDate.value)
  const modifier = direction === 'next' ? 1 : -1

  if (currentView.value === 'day') {
    date.setDate(date.getDate() + modifier)
  } else {
    date.setDate(date.getDate() + (7 * modifier))
  }

  currentDate.value = date
  emit('date-change', currentDate.value)
}

watch(() => props.reservations, (newReservations) => {
  emit('reservations-updated', newReservations)
}, { deep: true, immediate: true })

onMounted(() => {
  if (currentView.value === 'week') {
    const weekStart = getWeekStart(currentDate.value)
    currentDate.value = weekStart
  }
})
</script>

<style scoped>
.calendar-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: #f9fafb; /* bg-gray-50 */
  border: 1px solid rgba(10, 10, 10, 0.2); /* gray-950/20 */
  border-radius: 8px;
  overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb; /* gray-50 */
  border-bottom: 1px solid rgba(10, 10, 10, 0.2); /* gray-950/20 */
  flex-wrap: wrap;
  gap: 0.5rem;
}

.calendar-title h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #0a0a0a; /* text-gray-950 */
}

.calendar-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  background: #ffffff;
  border: 1px solid rgba(10, 10, 10, 0.2);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-text {
  display: inline-block;
}

.btn:hover {
  background: #f3f4f6;
}

.btn-active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.calendar-content {
  overflow-x: auto;
  overflow-y: hidden;
}

.calendar-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.time-column {
  width: 80px;
  min-width: 80px;
}

.day-column {
  min-width: 150px;
  text-align: center;
}

.day-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

th {
  padding: 0.75rem 0.5rem;
  background: #f9fafb; /* gray-50 */
  border: 1px solid rgba(10, 10, 10, 0.2);
  font-weight: 600;
  color: #0a0a0a; /* text-gray-950 */
  font-size: 0.875rem;
}

.day-date {
  font-size: 0.75rem;
  color: #0a0a0a;
  font-weight: normal;
}

.time-cell {
  padding: 0.5rem;
  border: 1px solid rgba(10, 10, 10, 0.2);
  background: #f9fafb;
  font-size: 0.875rem;
  color: #0a0a0a;
  text-align: center;
  vertical-align: top;
}

.calendar-cell {
  height: 80px;
  padding: 2px;
  border: 1px solid rgba(10, 10, 10, 0.2);
  position: relative;
  vertical-align: top;
  background: #f9fafb;
}

.reservation-card {
  background: #09090b;
  color: #f9fafb;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.reservation-card:hover {
  opacity: 0.8;
}

.reservation-content {
  padding: 0.5rem;
}

.reservation-title {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 1.2;
}

.reservation-time {
  margin: 0;
  font-size: 0.625rem;
  opacity: 0.8;
}

@media (max-width: 1024px) {
  .calendar-container {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
  }
  
  .calendar-header {
    padding: 0.75rem;
  }
  
  .calendar-title h1 {
    font-size: 1.125rem;
  }
  
  .btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }
  
  .day-column {
    min-width: 120px;
  }
  
  .calendar-cell {
    height: 70px;
  }
}

@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .calendar-title h1 {
    font-size: 1rem;
    text-align: center;
  }
  
  .calendar-controls {
    justify-content: center;
  }
  
  .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    flex: 1;
    min-width: 60px;
  }
  
  .calendar-content {
    overflow-x: auto;
    overflow-y: auto;
    max-height: 60vh;
  }
  
  .calendar-table {
    min-width: 500px;
  }
  
  .time-column {
    width: 60px;
    min-width: 60px;
  }
  
  .day-column {
    min-width: 100px;
  }
  
  .calendar-cell {
    height: 60px;
  }
  
  .reservation-content {
    padding: 0.25rem;
  }
  
  .reservation-title {
    font-size: 0.6875rem;
  }
  
  .reservation-time {
    font-size: 0.5625rem;
  }
  
  th {
    padding: 0.5rem 0.25rem;
    font-size: 0.75rem;
  }
  
  .time-cell {
    padding: 0.25rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .calendar-header {
    padding: 0.5rem;
  }
  
  .calendar-title h1 {
    font-size: 0.875rem;
  }
  
  .btn {
    padding: 0.25rem 0.375rem;
    font-size: 0.6875rem;
    min-width: 50px;
  }
  
  .calendar-table {
    min-width: 400px;
  }
  
  .time-column {
    width: 50px;
    min-width: 50px;
  }
  
  .day-column {
    min-width: 80px;
  }
  
  .calendar-cell {
    height: 50px;
  }
  
  .reservation-content {
    padding: 0.125rem;
  }
  
  .reservation-title {
    font-size: 0.625rem;
    margin-bottom: 0.125rem;
  }
  
  .reservation-time {
    font-size: 0.5rem;
  }
  
  th {
    padding: 0.375rem 0.125rem;
    font-size: 0.6875rem;
  }
  
  .time-cell {
    padding: 0.125rem;
    font-size: 0.6875rem;
  }
  
  .day-date {
    font-size: 0.625rem;
  }
}
    
@media (prefers-color-scheme: dark) {
  .calendar-container {
    background: #0a0a0a; /* inverse of gray-50 */
    border-color: rgba(249, 250, 251, 0.2); /* gray-50/20 */
  }
  
  .calendar-header {
    background: #0a0a0a;
    border-color: rgba(249, 250, 251, 0.2);
  }
  
  .calendar-title h1 {
    color: #f9fafb; /* text-gray-50 */
  }
  
  .btn {
    background: #111827;
    border-color: rgba(249, 250, 251, 0.2);
    color: #f9fafb;
  }
  
  .btn:hover {
    background: #1f2937;
  }
  
  th, .time-cell {
    background: #0a0a0a;
    border-color: rgba(249, 250, 251, 0.2);
    color: #f9fafb;
  }
  
  .calendar-cell {
    border-color: rgba(249, 250, 251, 0.2);
    background: #0a0a0a;
  }
}
</style>
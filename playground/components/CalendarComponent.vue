<template>
  <div class="w-full max-w-7xl mx-auto bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden font-sans">
    <div class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700">
      <div>
        <h1 class="text-xl font-semibold text-gray-700 dark:text-gray-100">{{ formatCurrentDate }}</h1>
      </div>
      <div class="flex gap-2">
        <button 
          class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
          :class="{ 'bg-blue-500 text-gray-950 border-blue-500 dark:bg-blue-600 dark:border-blue-600': currentView === 'day' }"
          @click="changeView('day')"
        >
          Jour
        </button>
        <button 
          class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
          :class="{ 'bg-blue-500 text-gray-900 border-blue-500 dark:bg-blue-600 dark:border-blue-600': currentView === 'week' }"
          @click="changeView('week')"
        >
          Semaine
        </button>
        <button class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200" @click="navigateDate('prev')">
          ←
        </button>
        <button class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200" @click="navigateDate('next')">
          →
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <div>
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="w-20 min-w-20 p-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-sm">Heure</th>
              <th v-if="currentView === 'day'" class="min-w-36 text-center p-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                {{ formatDayHeader(currentDate) }}
              </th>
              <th v-else v-for="(day, index) in days" :key="day" class="min-w-36 text-center p-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                <div>{{ day }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 font-normal">{{ formatDayDate(getDateForDay(index)) }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hour in hours" :key="hour">
              <td class="p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-sm text-gray-500 dark:text-gray-400 text-center align-top">
                {{ String(hour).padStart(2, '0') }}:00
              </td>
              <td v-if="currentView === 'day'" class="h-20 p-1 border border-gray-200 dark:border-gray-700 relative align-top bg-white dark:bg-gray-900">
                <div
                  v-for="reservation in getReservationsForHour(hour)"
                  :key="reservation.id"
                  class="reservation-card bg-gray-800 dark:bg-gray-700 text-white rounded cursor-pointer overflow-hidden transition-transform "
                  :style="getReservationStyle(reservation, hour)"
                  @click="handleReservationClick(reservation)"
                >
                  <div class="p-2">
                    <p class="font-semibold text-xs leading-tight mb-1">{{ reservation.title }}</p>
                    <p class="text-xs opacity-80">{{ formatTime(reservation.start_date) }}</p>
                  </div>
                </div>
              </td>
              <td v-else v-for="(day, index) in days" :key="`${day}-${hour}`" class="h-20 p-1 border border-gray-200 dark:border-gray-700 relative align-top bg-white dark:bg-gray-900">
                <div
                  v-for="reservation in getReservationsForDayAndHour(index, hour)"
                  :key="reservation.id"
                  class="reservation-card bg-gray-800 dark:bg-gray-700 text-white rounded cursor-pointer overflow-hidden transition-transform hover:opacity-80"
                  :style="getReservationStyle(reservation, hour)"
                  @click="handleReservationClick(reservation)"
                >
                  <div class="p-2">
                    <p class="font-semibold text-xs leading-tight mb-1">{{ reservation.title }}</p>
                    <p class="text-xs opacity-80">{{ formatTime(reservation.start_date) }}</p>
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

interface Reservation {
  id: string
  title: string
  start_date: string
  end_date: string
  duration: number
  amount?: number
  phone?: string
}

interface WorkingHours {
  morning: number[]
  afternoon: number[]
}

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

const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const hours = [...props.workingHours.morning, ...props.workingHours.afternoon]
const currentView = ref<'day' | 'week'>(props.isMobile ? 'day' : 'week')
const currentDate = ref(new Date())

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
  return new Date(d.setDate(diff))
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
  return props.reservations.filter(reservation => {
    const reservationDate = new Date(reservation.start_date)
    const sameDay = 
      reservationDate.getFullYear() === date.getFullYear() &&
      reservationDate.getMonth() === date.getMonth() &&
      reservationDate.getDate() === date.getDate()
    const reservationHour = reservationDate.getHours()
    return sameDay && reservationHour === hour
  })
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
    currentDate.value = getWeekStart(currentDate.value)
  }
})
</script>


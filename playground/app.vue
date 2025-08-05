<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors" :class="currentTheme">
    <div class="max-w-6xl mx-auto p-8">
      <div class="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div class="flex items-center gap-2 lg:justify-between justify-end w-full">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Nuxt Calendar Module Playground</h1>

          <button 
          class="px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-gray-100 dark:text-gray-200 rounded-lg transition-colors border border-gray-600 dark:border-gray-500 flex items-center gap-2"
          @click="toggleTheme"
        >
          <span v-if="currentTheme === 'dark'">Light</span>
          <span v-else>Dark</span>
        </button>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <CalendarComponent
          :reservations="sampleReservations"
          :events="events"
          :working-hours="workingHours"
          :is-mobile="false"
          locale="fr-FR"
          timezone="Europe/Paris"
          theme="auto"
          @reservation-click="onReservationClick"
          @view-change="onViewChange"
          @date-change="onDateChange"
          @new-reservation="onNewReservation"
          @reservations-updated="onReservationsUpdated"
        />
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Utilisation du composable useCalendar</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">Mois actuel</p>
            <p class="font-semibold text-lg text-gray-900 dark:text-gray-100">{{ monthName }} {{ currentYear }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">Date sélectionnée</p>
            <p class="font-semibold text-lg text-gray-900 dark:text-gray-100">{{ selectedDate?.toLocaleDateString() || 'Aucune' }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">Nombre d'événements</p>
            <p class="font-semibold text-lg text-gray-900 dark:text-gray-100">{{ events.length }}</p>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-6">
          <button @click="goToPreviousMonth" class="px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-gray-100 dark:text-gray-200 rounded-lg transition-colors border border-gray-600 dark:border-gray-500">← Mois précédent</button>
          <button @click="goToToday" class="px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-gray-100 dark:text-gray-200 rounded-lg transition-colors border border-gray-600 dark:border-gray-500">Aujourd'hui</button>
          <button @click="goToNextMonth" class="px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-gray-100 dark:text-gray-200 rounded-lg transition-colors border border-gray-600 dark:border-gray-500">Mois suivant →</button>
          <button @click="addSampleEvent" class="px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-gray-100 dark:text-gray-200 rounded-lg transition-colors border border-gray-600 dark:border-gray-500">Ajouter événement</button>
          <button @click="addSampleReservation" class="px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-gray-100 dark:text-gray-200 rounded-lg transition-colors border border-gray-600 dark:border-gray-500">Ajouter réservation aléatoire</button>
          <button @click="clearAllReservations" class="px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-gray-100 dark:text-gray-200 rounded-lg transition-colors border border-gray-600 dark:border-gray-500">Vider tout</button>
          <button @click="showReservationsList" class="px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-gray-100 dark:text-gray-200 rounded-lg transition-colors border border-gray-600 dark:border-gray-500">Voir toutes les réservations ({{ sampleReservations.length }})</button>
        </div>
        
        <div class="grid grid-cols-7 gap-2">
          <div v-for="day in weekDays" :key="day" class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 text-center rounded font-medium text-sm">{{ day }}</div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Configuration du module</h2>
        <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm"><code class="text-gray-800 dark:text-gray-200">{{ JSON.stringify(config, null, 2) }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SimpleCalendar from '../src/runtime/components/SimpleCalendar.vue'

const calendar = useCalendar({
  locale: 'fr-FR'
})

const {
  currentYear,
  monthName,
  selectedDate,
  events,
  weekDays,
  config,
  goToPreviousMonth,
  goToNextMonth,
  goToToday,
  addEvent
} = calendar

const reservationCalendar = useReservationCalendar({
  locale: 'fr-FR',
  timezone: 'Europe/Paris'
})

const sampleReservations = ref([
  {
    id: '1',
    title: 'Conférence tech',
    start_date: '2025-08-04T14:00:00+02:00',
    end_date: '2025-08-04T15:00:00+02:00',
    duration: 60,
    amount: 150,
    phone: '+33123456789'
  },
  {
    id: '2',
    title: 'Entretien embauche',
    start_date: '2025-08-04T16:00:00+02:00',
    end_date: '2025-08-04T17:00:00+02:00',
    duration: 60,
    amount: 0
  },
  
  {
    id: '3',
    title: 'Formation développeur',
    start_date: '2025-08-05T09:00:00+02:00',
    end_date: '2025-08-05T11:00:00+02:00',
    duration: 120,
    amount: 300,
    phone: '+33987654321'
  },
  
  {
    id: '4',
    title: 'Présentation client VIP',
    start_date: '2025-08-06T14:00:00+02:00',
    end_date: '2025-08-06T16:00:00+02:00',
    duration: 120,
    amount: 500,
    phone: '+33111222333'
  },
  
  {
    id: '5',
    title: 'Audit sécurité',
    start_date: '2025-08-07T10:00:00+02:00',
    end_date: '2025-08-07T12:00:00+02:00',
    duration: 120,
    amount: 400,
    phone: '+33444555666'
  },

  {
    id: '6',
    title: 'Réunion équipe',
    start_date: '2025-08-08T09:00:00+02:00',
    end_date: '2025-08-08T17:00:00+02:00',
    duration: 480,
    amount: 0,
    phone: ''
  },
  
  {
    id: '7',
    title: 'Maintenance serveur',
    start_date: '2025-08-09T15:00:00+02:00',
    end_date: '2025-08-09T17:00:00+02:00',
    duration: 120,
    amount: 200,
    phone: '+33555444333'
  },
  
  {
    id: '8',
    title: 'Formation week-end',
    start_date: '2025-08-10T10:00:00+02:00',
    end_date: '2025-08-10T16:00:00+02:00',
    duration: 360,
    amount: 600,
    phone: '+33222333444'
  },
  
  {
    id: '9',
    title: 'Séminaire entreprise',
    start_date: '2025-08-11T09:00:00+02:00',
    end_date: '2025-08-11T18:00:00+02:00',
    duration: 540,
    amount: 1200,
    phone: '+33666777888'
  },
  
  {
    id: '10',
    title: 'Rendez-vous Client A',
    start_date: '2025-08-12T11:00:00+02:00',
    end_date: '2025-08-12T12:00:00+02:00',
    duration: 60,
    amount: 150,
    phone: '+33777888999'
  }
])

const workingHours = {
  morning: [9, 10, 11, 12],
  afternoon: [14, 15, 16, 17]
}

const currentTheme = ref('auto')

function toggleTheme() {
  if (currentTheme.value === 'dark') {
    currentTheme.value = 'light'
    document.documentElement.classList.remove('dark')
  } else {
    currentTheme.value = 'dark'
    document.documentElement.classList.add('dark')
  }
  
  if (process.client) {
    localStorage.setItem('theme-preference', currentTheme.value)
  }
}

onMounted(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme-preference')
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      currentTheme.value = savedTheme
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {  
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        document.documentElement.classList.add('dark')
        currentTheme.value = 'dark'
      }
    }
  }
})



function onReservationClick(reservation) {
  // DO something
}

function onViewChange(view, date) {
  // DO something
}

function onDateChange(date) {
  // DO something
}

function onNewReservation(reservation) {
  // DO something
}

function onReservationsUpdated(reservations) {
  // DO something
}

function addSampleEvent() {
  addEvent({
    id: Date.now(),
    title: `Événement ${events.value.length + 1}`,
    description: 'Événement d\'exemple',
    date: new Date(),
    color: '#3b82f6'
  })
}

function addSampleReservation() {
  const randomTitles = [
    'Nouvelle consultation',
    'Réunion projet',
    'Formation technique',
    'Entretien candidat',
    'Appel client',
    'Révision code',
    'Démonstration produit',
    'Analyse besoins'
  ]
  
  const randomDays = [1, 3, 7, 14, 21, 28]
  const randomHours = [9, 10, 11, 14, 15, 16]
  const randomDurations = [30, 45, 60, 90] 
  
  const selectedDay = randomDays[Math.floor(Math.random() * randomDays.length)]
  const selectedHour = randomHours[Math.floor(Math.random() * randomHours.length)]
  const selectedDuration = randomDurations[Math.floor(Math.random() * randomDurations.length)]
  const selectedTitle = randomTitles[Math.floor(Math.random() * randomTitles.length)]
  
  const startTime = Date.now() + selectedDay * 24 * 60 * 60 * 1000 + selectedHour * 60 * 60 * 1000
  
  const maxEndHour = 18 
  const endHour = selectedHour + (selectedDuration / 60)
  
  if (endHour > maxEndHour) {
    const adjustedDuration = (maxEndHour - selectedHour) * 60
    const endTime = startTime + adjustedDuration * 60 * 1000
    
    const newReservation = {
      id: Date.now().toString(),
      title: `${selectedTitle} ${sampleReservations.value.length + 1}`,
      start_date: new Date(startTime).toISOString(),
      end_date: new Date(endTime).toISOString(),
      duration: adjustedDuration,
      amount: Math.floor(Math.random() * 500) + 50,
      phone: `+3361234${Math.floor(Math.random() * 90) + 10}${Math.floor(Math.random() * 90) + 10}`
    }
    sampleReservations.value.push(newReservation)
  } else {
    const endTime = startTime + selectedDuration * 60 * 1000
    
    const newReservation = {
      id: Date.now().toString(),
      title: `${selectedTitle} ${sampleReservations.value.length + 1}`,
      start_date: new Date(startTime).toISOString(),
      end_date: new Date(endTime).toISOString(),
      duration: selectedDuration,
      amount: Math.floor(Math.random() * 500) + 50,
      phone: `+3361234${Math.floor(Math.random() * 90) + 10}${Math.floor(Math.random() * 90) + 10}`
    }
    sampleReservations.value.push(newReservation)
  }
}

function onTestEvent(message) {
  // DO something
}

function clearAllReservations() {
  sampleReservations.value = []
  // DO something
}

function showReservationsList() {
  // DO something
  sampleReservations.value.forEach((reservation, index) => {
    const startDate = new Date(reservation.start_date)
    const endDate = new Date(reservation.end_date)
    // DO something
  })
  // DO something
}
</script>


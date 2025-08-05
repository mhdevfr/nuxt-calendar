<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors" :class="currentTheme">
    <div class="max-w-6xl mx-auto p-8">
      <div class="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">🗓️ Nuxt Calendar Module Playground</h1>
        <button 
          class="px-4 py-2 bg-gray-50 hover:bg-gray-800 border border-gray-950 border-opacity-15 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-900 dark:text-gray-900 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
          @click="toggleTheme"
        >
          <span v-if="currentTheme === 'dark'">Mode Clair</span>
          <span v-else>Mode Sombre</span>
        </button>
      </div>
      
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">📅 Votre Calendar de réservations</h2>
        <CalendarComponent
          :reservations="sampleReservations"
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
        <SimpleCalendar :events="events" :locale="locale" :theme="theme" :timezone="timezone" :is-mobile="isMobile" />
        <Calendar :events="events" :locale="locale" :theme="theme" :timezone="timezone" :is-mobile="isMobile" />
        <BaseCalendar :events="events" :locale="locale" :theme="theme" :timezone="timezone" :is-mobile="isMobile" />

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
          <button @click="goToPreviousMonth" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">← Mois précédent</button>
          <button @click="goToToday" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">Aujourd'hui</button>
          <button @click="goToNextMonth" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Mois suivant →</button>
          <button @click="addSampleEvent" class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">Ajouter événement</button>
          <button @click="addSampleReservation" class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">Ajouter réservation aléatoire</button>
          <button @click="clearAllReservations" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">Vider tout</button>
          <button @click="showReservationsList" class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors">Voir toutes les réservations ({{ sampleReservations.length }})</button>
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
    title: 'Rendez-vous Client A',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    duration: 60,
    amount: 150,
    phone: '+33123456789'
  },
  {
    id: '2',
    title: 'Réunion équipe',
    start_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    amount: 0
  },
  
  {
    id: '3',
    title: 'Formation développeur',
    start_date: new Date(Date.now() + 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString(),
    duration: 120,
    amount: 300,
    phone: '+33987654321'
  },
  
  {
    id: '4',
    title: 'Présentation client VIP',
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000).toISOString(),
    duration: 120,
    amount: 500,
    phone: '+33111222333'
  },
  
  {
    id: '5',
    title: 'Audit sécurité',
    start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
    duration: 120,
    amount: 400,
    phone: '+33444555666'
  },

  {
    id: '6',
    title: 'Conférence tech',
    start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000).toISOString(),
    duration: 480,
    amount: 0,
    phone: ''
  },
  
  {
    id: '7',
    title: 'Entretien embauche',
    start_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    amount: 0,
    phone: '+33777888999'
  },
  
  {
    id: '8',
    title: 'Maintenance serveur',
    start_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000).toISOString(),
    duration: 120,
    amount: 200,
    phone: '+33555444333'
  },
  
  {
    id: '9',
    title: 'Formation week-end',
    start_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000).toISOString(),
    duration: 360,
    amount: 600,
    phone: '+33222333444'
  },
  
    {
    id: '10',
    title: 'Séminaire entreprise',
    start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000).toISOString(),  
    duration: 540,
    amount: 1200,
    phone: '+33666777888'
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
  console.log('Réservation cliquée:', reservation)
}

function onViewChange(view, date) {
  console.log('Vue changée:', view, date)
}

function onDateChange(date) {
  console.log('Date changée:', date)
}

function onNewReservation(reservation) {
  console.log('Nouvelle réservation:', reservation)
}

function onReservationsUpdated(reservations) {
  console.log('Réservations mises à jour:', reservations.length)
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
    console.log('Nouvelle réservation ajoutée (durée ajustée):', newReservation)
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
    console.log('Nouvelle réservation ajoutée:', newReservation)
  }
}

function onTestEvent(message) {
  console.log('Test Event reçu:', message)
}

function clearAllReservations() {
  sampleReservations.value = []
  console.log('Toutes les réservations ont été supprimées')
}

function showReservationsList() {
  console.log('=== LISTE COMPLÈTE DES RÉSERVATIONS ===')
  sampleReservations.value.forEach((reservation, index) => {
    const startDate = new Date(reservation.start_date)
    const endDate = new Date(reservation.end_date)
    console.log(`${index + 1}. ${reservation.title}`)
    console.log(`   Date: ${startDate.toLocaleDateString('fr-FR')}`)
    console.log(`   Heure: ${startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`)
    console.log(`   Durée: ${reservation.duration} min`)
    console.log(`   Montant: ${reservation.amount}€`)
    console.log(`   Téléphone: ${reservation.phone || 'Non renseigné'}`)
    console.log('   ---')
  })
  console.log(`Total: ${sampleReservations.value.length} réservations`)
}
</script>


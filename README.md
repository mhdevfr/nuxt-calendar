# nuxt-calendar-module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A modern and customizable calendar module for Nuxt 3, born from the need to simplify complex scheduling components.

<img width="1440" height="900" alt="Capture d’écran 2025-08-05 à 04 09 25" src="https://github.com/user-attachments/assets/94f3eeeb-bb38-4580-8d61-1404a57488c3" />

## The Story Behind This Module

I originally built an admin dashboard for sports coaching sessions, and the calendar component I created manually was quite complex for me to maintain. That's when I decided to create my first Nuxt module to make this reusable and easier to manage. This module is the result of that journey - a clean, modular calendar solution that can be easily integrated into any Nuxt 3 project.

## Features

## Features

- ✨ **Auto-import** - Components and composables automatically imported
- 🎨 **Themes** - Light, dark and automatic theme support
- 🌍 **Internationalization** - Complete locale support
- 📱 **Responsive** - Adapted for mobile and tablets
- ⚡ **Performance** - Optimized with Vue 3 and Composition API
- 🎯 **TypeScript** - Complete TypeScript support
- 🔧 **Configurable** - Flexible configuration options
- 📅 **Events** - Complete event management
- 🏃‍♂️ **Sports Coaching Ready** - Perfect for scheduling sports sessions
- 📊 **Admin Dashboard** - Built with admin interfaces in mind

## Quick Installation

1. Add `nuxt-calendar-module` to your project dependencies:

```bash
# npm
npm install nuxt-calendar-module

# pnpm
pnpm add nuxt-calendar-module

# yarn
yarn add nuxt-calendar-module
```

2. Add `nuxt-calendar-module` to the `modules` section of `nuxt.config.ts`:

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-calendar-module'
  ]
})
```

That's it! You can now use the Calendar component in your Nuxt application ✨

## Usage

### Recommended usage with CalendarComponent

```vue
<template>
  <div>
    <CalendarComponent 
      :locale="$i18n.locale.value"
      :timezone="userTimezone"
      :theme="$colorMode.value"
      :reservations="reservations"
      @new-reservation="handleNewReservation"
      @reservation-click="handleClick"
    />
  </div>
</template>

<script setup>
const reservations = ref([
  {
    id: '1',
    title: 'Client Session',
    start_date: '2024-01-15T09:00:00.000Z',
    end_date: '2024-01-15T10:00:00.000Z',
    duration: 60
  }
])

const userTimezone = 'Europe/Paris'

function handleNewReservation(reservation) {
  reservations.value.push(reservation)
}

function handleClick(reservation) {
  console.log('Reservation clicked:', reservation)
}
</script>
```

### Direct Calendar component usage

```vue
<template>
  <div>
    <Calendar 
      :reservations="reservations"
      :working-hours="workingHours"
      locale="fr-FR"
      timezone="Europe/Paris"
      theme="auto"
      @reservation-click="onReservationClick"
      @view-change="onViewChange"
    />
  </div>
</template>

<script setup>
const workingHours = {
  morning: [9, 10, 11, 12],
  afternoon: [14, 15, 16, 17]
}

function onReservationClick(reservation) {
  console.log('Reservation clicked:', reservation)
}

function onViewChange(view, date) {
  console.log('View changed:', view, date)
}
</script>
```

### Simple calendar with events

```vue
<template>
  <div>
    <SimpleCalendar 
      :events="events"
      :locale="$i18n.locale.value"
      :theme="$colorMode.value"
      @date-select="onDateSelect"
      @event-click="onEventClick"
    />
  </div>
</template>

<script setup>
const events = ref([
  {
    id: 1,
    title: 'Team Meeting',
    date: new Date(),
    color: '#3b82f6'
  },
  {
    id: 2,
    title: 'Client Presentation',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    color: '#ef4444'
  }
])

function onDateSelect(date) {
  console.log('Date selected:', date)
}

function onEventClick(event) {
  console.log('Event clicked:', event)
}
</script>
```

### With composables

```vue
<template>
  <div>
    <h2>{{ monthName }} {{ currentYear }}</h2>
    <button @click="goToPreviousMonth">← Previous</button>
    <button @click="goToNextMonth">Next →</button>
    <p>Selected date: {{ selectedDate?.toLocaleDateString() }}</p>
    
    <!-- Use your own components with composable data -->
    <div class="custom-calendar">
      <!-- Your custom implementation -->
    </div>
  </div>
</template>

<script setup>
// Generic calendar composable
const {
  currentYear,
  monthName,
  selectedDate,
  calendarDates,
  goToNextMonth,
  goToPreviousMonth,
  addEvent
} = useCalendar({
  locale: 'fr-FR'
})

// Reservation calendar composable
const reservationCalendar = useReservationCalendar({
  locale: 'fr-FR',
  timezone: 'Europe/Paris'
})

// Add an event
addEvent({
  id: 1,
  title: 'Team Meeting',
  date: new Date(),
  color: '#3b82f6'
})
</script>
```

## Configuration

Configure the module in your `nuxt.config.ts`:

```js
export default defineNuxtConfig({
  modules: ['@nuxtjs/calendar'],
  calendar: {
    // Prefix for auto-imported components
    prefix: 'Nuxt',
    
    // Default configuration
    defaultConfig: {
      locale: 'fr-FR',
      firstDayOfWeek: 1, // 0 = Sunday, 1 = Monday
      showWeekNumbers: false,
      theme: 'auto' // 'light', 'dark', 'auto'
    }
  }
})
```

## useCalendar composable options

```ts
const calendar = useCalendar({
  locale: 'fr-FR',
  firstDayOfWeek: 1,
  showWeekNumbers: true,
  theme: 'dark',
  minDate: new Date('2023-01-01'),
  maxDate: new Date('2024-12-31'),
  disabledDates: [
    new Date('2024-01-01'), // New Year's Day
    new Date('2024-12-25')  // Christmas
  ]
})
```

## TypeScript Types

The module includes complete TypeScript types:

```ts
interface CalendarEvent {
  id: string | number
  title: string
  description?: string
  date: Date
  startTime?: string
  endTime?: string
  color?: string
  category?: string
  allDay?: boolean
}

interface CalendarDate {
  year: number
  month: number
  day: number
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isDisabled?: boolean
  events?: CalendarEvent[]
}
```

## Available Components

### CalendarComponent (Recommended)
Main component for reservations with optimized Nuxt integration.

### Calendar
Reservation component with all advanced features.

### SimpleCalendar
Simple monthly calendar for displaying events.

### BaseCalendar
Flexible base component with slots for complete customization.

## Component Events

### CalendarComponent & Calendar
- `reservation-click`: Emitted when a reservation is clicked
- `view-change`: Emitted when the view changes (day/week)
- `date-change`: Emitted when the navigation date changes
- `new-reservation`: Emitted for a new reservation
- `reservations-updated`: Emitted when reservations are updated

### SimpleCalendar & BaseCalendar
- `date-select`: Emitted when a date is selected
- `month-change`: Emitted when the month changes
- `event-click`: Emitted when an event is clicked

## Advanced Customization

### Using BaseCalendar with slots

```vue
<template>
  <BaseCalendar 
    :locale="locale"
    :theme="theme"
    :events="events"
    @date-select="onDateSelect"
  >
    <!-- Customize header -->
    <template #header="{ currentDate, navigation }">
      <div class="my-custom-header">
        <button @click="navigation.goToPreviousMonth">◀</button>
        <h3>{{ formatDate(currentDate) }}</h3>
        <button @click="navigation.goToNextMonth">▶</button>
      </div>
    </template>

    <!-- Customize day content -->
    <template #day-content="{ date, events }">
      <div class="my-day-content">
        <div class="my-events">
          <span v-for="event in events" :key="event.id" class="my-event">
            🎉 {{ event.title }}
          </span>
        </div>
      </div>
    </template>
  </BaseCalendar>
</template>
```

## Development

```bash
# Install dependencies
npm install

# Generate type files
npm run dev:prepare

# Develop with playground
npm run dev

# Build the module
npm run build

# Run tests
npm run test
```

## Contributing

Contributions are welcome! Please check our [contributing guide](CONTRIBUTING.md).

## License

[MIT License](./LICENSE)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/calendar/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxtjs/calendar

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxtjs/calendar.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/calendar

[license-src]: https://img.shields.io/npm/l/@nuxtjs/calendar.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@nuxtjs/calendar

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com

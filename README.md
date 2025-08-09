# nuxt-calendar-module

A modern, customizable calendar package for Vue 3 / Nuxt 3. Includes typed composables and ready-to-use components, per-component light/dark theming, and reservation helpers (details + add modals).

## Install

```bash
npm install nuxt-calendar-module
```

Add the stylesheet once (Nuxt example):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['nuxt-calendar-module/runtime/assets/calendar.css']
})
```

Or import globally:

```ts
// app entry or app.vue
import 'nuxt-calendar-module/runtime/assets/calendar.css'
```

## Quick start

Render a reservation calendar in minutes.

```vue
<template>
  <CalendarComponent
    :locale="'en-US'"
    :timezone="'Europe/Paris'"
    :theme="'light'"    
    :reservations="reservations"
    @reservation-click="onReservationClick"
    @new-reservation="onNewReservation"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'nuxt-calendar-module/runtime/assets/calendar.css'
import CalendarComponent from 'nuxt-calendar-module/runtime/components/CalendarComponent.vue'

const reservations = ref([
  { id: '1', title: 'Client Session', start_date: '2025-08-04T14:00:00+02:00', end_date: '2025-08-04T15:00:00+02:00', duration: 60 }
])

function onReservationClick(reservation: any) {}
function onNewReservation(reservation: any) { reservations.value.push(reservation) }
</script>
```

## Components

Import from `nuxt-calendar-module/runtime/components`.

- `CalendarComponent.vue`: High-level reservation calendar (recommended)
- `Calendar.vue`: Table-based reservation calendar
- `SimpleCalendar.vue`: Monthly events grid
- `BaseCalendar.vue`: Slot-based base calendar
- `ReservationModal.vue`: Read-only modal with reservation details
- `AddReservationModal.vue`: Form modal (single-day; start/end time; duration auto-computed)

### Calendar props (main ones)

- `reservations?: Reservation[]`
- `working-hours?: { morning: number[]; afternoon: number[] }`
- `locale?: string` (default `fr-FR`)
- `timezone?: string` (default `Europe/Paris`)
- `theme?: 'light' | 'dark' | 'auto'` (scoped, see theming)

### Calendar events

- `reservation-click` (reservation)
- `view-change` (view: 'day' | 'week', date: Date)
- `date-change` (date: Date)
- `new-reservation` (reservation)
- `reservations-updated` (reservations: Reservation[])

### Modals

Details modal:
```vue
<ReservationModal :visible="open" :reservation="current" :locale="'en-US'" @close="open=false" />
```

Add modal:
```vue
<AddReservationModal :visible="addOpen" @close="addOpen=false" @submit="onCreate" />
```
`onCreate` receives `{ id, title, start_date, end_date, duration, amount?, phone? }`.

## Composables

Import from `nuxt-calendar-module/runtime/composables`.

```ts
// Generic calendar
const { currentYear, monthName, selectedDate, calendarDates, goToNextMonth, goToPreviousMonth, addEvent } =
  useCalendar({ locale: 'en-US' })

// Reservation calendar
const r = useReservationCalendar({ locale: 'en-US', timezone: 'Europe/Paris' })
r.addReservation({ id: 'r1', title: 'Call', start_date: new Date().toISOString(), end_date: new Date(Date.now()+3600000).toISOString(), duration: 60 })
```

## Theming (scoped)

The calendar theme is scoped to the component root via `data-theme` and will not affect the rest of the page.

- `theme="light"` (default palette)
  - background: gray-50; borders: gray-950 at 20%; text: gray-950
- `theme="dark"` (inverse palette)
  - background: near black; borders: light at 20%; text: gray-50
- `theme="auto"` follows OS preference

Switch live:
```vue
<CalendarComponent :theme="currentTheme" />
```

## Types

```ts
export interface Reservation {
  id: string | number
  title: string
  start_date: string
  end_date: string
  duration: number
  amount?: number
  phone?: string
}
```

## Dev / Playground

```bash
npm install
npm run build
cd playground && npm run dev
```

## Tests

```bash
npm run test
```

## Release

Manual:
```bash
npm version patch -m "chore(release): v%s"
git push origin main --tags
npm publish --access public
```

GitHub Actions: push a tag `vX.Y.Z` after adding `NPM_TOKEN` in repo settings → Secrets → Actions.

## License

MIT
# nuxt-calendar-module

<!-- Badges will be available after first release -->
<!-- [![npm version][npm-version-src]][npm-version-href] -->
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A modern and customizable calendar package for Vue 3 / Nuxt 3, born from the need to simplify complex scheduling components. This is a community package, not officially maintained by the Nuxt team.

<img width="1440" height="900" alt="Capture d'écran 2025-08-05 à 04 09 25" src="https://github.com/user-attachments/assets/94f3eeeb-bb38-4580-8d61-1404a57488c3" />

## The Story Behind This Module

I originally built an admin dashboard for sports coaching sessions, and the calendar component I created manually was quite complex for me to maintain. That's when I decided to create my first Nuxt module to make this reusable and easier to manage. This module is the result of that journey - a clean, modular calendar solution that can be easily integrated into any Nuxt 3 project.

## Features

- ✨ **Easy imports** - Import components and composables directly
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

2. Add the CSS (recommended)

Nuxt 3 (`nuxt.config.ts`):

```ts
export default defineNuxtConfig({
  css: ['nuxt-calendar-module/runtime/assets/calendar.css']
})
```

ou import global (ex. `app.vue`):

```ts
// app.vue or a global entry
import 'nuxt-calendar-module/runtime/assets/calendar.css'
```

That's it! You can now import and use the Calendar components in your application ✨

## Status

🚧 **Community Module** - This module is maintained by the community and is not officially supported by the Nuxt team. Use at your own discretion.

## Development

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/nuxt-module-calendar.git
cd nuxt-module-calendar
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the playground**
```bash
cd playground
npm run dev
```

4. **Run tests**
```bash
npm run test
```

### Testing the Package

You can test the module locally before publishing:

```bash
# Build the module
npm run build

# Pack it locally
npm pack

# Install in a test project
npm install ../path/to/nuxt-calendar-module-1.0.1.tgz
```

## Usage

### Quick usage with CalendarComponent

```vue
<template>
  <div>
    <CalendarComponent 
      :locale="'fr-FR'"
      :timezone="'Europe/Paris'"
      :theme="'auto'"
      :reservations="reservations"
      @new-reservation="handleNewReservation"
      @reservation-click="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'nuxt-calendar-module/runtime/assets/calendar.css'
import CalendarComponent from 'nuxt-calendar-module/runtime/components/CalendarComponent.vue'

const reservations = ref([
  {
    id: '1',
    title: 'Client Session',
    start_date: '2024-01-15T09:00:00.000Z',
    end_date: '2024-01-15T10:00:00.000Z',
    duration: 60
  }
])

function handleNewReservation(reservation: any) {
  reservations.value.push(reservation)
}

function handleClick(reservation: any) {
  console.log('Reservation clicked:', reservation)
}
</script>
```

### Calendar component usage (direct import)

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

<script setup lang="ts">
import 'nuxt-calendar-module/runtime/assets/calendar.css'
import Calendar from 'nuxt-calendar-module/runtime/components/Calendar.vue'

const reservations: any[] = []
const workingHours = {
  morning: [9, 10, 11, 12],
  afternoon: [14, 15, 16, 17]
}

function onReservationClick(reservation: any) {
  console.log('Reservation clicked:', reservation)
}

function onViewChange(view: 'day' | 'week', date: Date) {
  console.log('View changed:', view, date)
}
</script>
```

### Simple calendar with events (direct import)

```vue
<template>
  <div>
    <SimpleCalendar 
      :events="events"
      :locale="'fr-FR'"
      :theme="'auto'"
      @date-select="onDateSelect"
      @event-click="onEventClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'nuxt-calendar-module/runtime/assets/calendar.css'
import SimpleCalendar from 'nuxt-calendar-module/runtime/components/SimpleCalendar.vue'

const events = ref([
  { id: 1, title: 'Team Meeting', date: new Date(), color: '#3b82f6' },
  { id: 2, title: 'Client Presentation', date: new Date(Date.now() + 86400000), color: '#ef4444' }
])

function onDateSelect(date: Date) {
  console.log('Date selected:', date)
}

function onEventClick(event: any) {
  console.log('Event clicked:', event)
}
</script>
```

### With composables (direct import)

```vue
<template>
  <div>
    <h2>{{ monthName }} {{ currentYear }}</h2>
    <button @click="goToPreviousMonth">← Previous</button>
    <button @click="goToNextMonth">Next →</button>
    <p>Selected date: {{ selectedDate?.toLocaleDateString() }}</p>
    <div class="custom-calendar"></div>
  </div>
  </template>

<script setup lang="ts">
import 'nuxt-calendar-module/runtime/assets/calendar.css'
import { useCalendar } from 'nuxt-calendar-module/runtime/composables/useCalendar'
import { useReservationCalendar } from 'nuxt-calendar-module/runtime/composables/useReservationCalendar'

const {
  currentYear,
  monthName,
  selectedDate,
  calendarDates,
  goToNextMonth,
  goToPreviousMonth,
  addEvent
} = useCalendar({ locale: 'fr-FR' })

const reservationCalendar = useReservationCalendar({
  locale: 'fr-FR',
  timezone: 'Europe/Paris'
})

addEvent({ id: 1, title: 'Team Meeting', date: new Date(), color: '#3b82f6' })
</script>
```

## Configuration

No Nuxt module configuration is required. Optionally, add the CSS in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ['nuxt-calendar-module/runtime/assets/calendar.css']
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

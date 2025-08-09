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


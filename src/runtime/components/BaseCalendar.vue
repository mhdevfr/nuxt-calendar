<template>
  <div class="base-calendar" :data-theme="theme">
    <slot name="header" :current-date="currentDate" :navigation="{ goToPreviousMonth, goToNextMonth, goToToday }">
      <div class="calendar-header">
        <button @click="goToPreviousMonth" class="calendar-nav-button">
          ←
        </button>
        <h2 class="calendar-title">{{ monthName }} {{ currentYear }}</h2>
        <button @click="goToNextMonth" class="calendar-nav-button">
          →
        </button>
      </div>
    </slot>
    
    <slot 
      name="calendar" 
      :dates="calendarDates"
      :week-days="weekDays"
      :select-date="selectDate"
      :current-date="currentDate"
      :selected-date="selectedDate"
    >
        <div class="calendar-weekdays">
        <div v-for="day in weekDays" :key="day" class="calendar-weekday">
          {{ day }}
        </div>
      </div>
      
      <div class="calendar-grid">
        <div
          v-for="date in calendarDates"
          :key="`${date.year}-${date.month}-${date.day}`"
          class="calendar-day"
          :class="{
            'calendar-day--other-month': !date.isCurrentMonth,
            'calendar-day--today': date.isToday,
            'calendar-day--selected': date.isSelected,
            'calendar-day--disabled': date.isDisabled
          }"
          @click="selectDate(date.date)"
        >
          <span class="calendar-day-number">{{ date.day }}</span>
          <slot 
            name="day-content" 
            :date="date" 
            :events="date.events"
          >
            <div v-if="date.events?.length" class="calendar-events">
              <div
                v-for="event in date.events"
                :key="event.id"
                class="calendar-event"
                :style="{ backgroundColor: event.color }"
                @click.stop="$emit('event-click', event)"
              >
                {{ event.title }}
              </div>
            </div>
          </slot>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import type { CalendarEvent } from '../types'
import { useCalendar } from '../composables/useCalendar'

interface Props {
  locale?: string
  timezone?: string  
  theme?: 'light' | 'dark' | 'auto'
  events?: CalendarEvent[]
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'fr-FR',
  timezone: 'Europe/Paris',
  theme: 'auto',
  events: () => [],
  minDate: undefined,
  maxDate: undefined,
  disabledDates: () => []
})

const emit = defineEmits<{
  'date-select': [date: Date]
  'month-change': [month: number, year: number]
  'event-click': [event: CalendarEvent]
}>()

const {
  currentDate,
  selectedDate,
  currentMonth,
  currentYear,
  monthName,
  weekDays,
  calendarDates,
  goToNextMonth,
  goToPreviousMonth,
  goToToday,
  selectDate: calendarSelectDate
} = useCalendar({
  locale: props.locale,
  minDate: props.minDate,
  maxDate: props.maxDate,
  disabledDates: props.disabledDates
})

watchEffect(() => {
  calendarDates.value.forEach(date => {
    date.events = props.events.filter(event => 
      isSameDay(event.date, date.date)
    )
  })
})

function selectDate(date: Date) {
  calendarSelectDate(date)
  emit('date-select', date)
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

watch([currentMonth, currentYear], ([month, year]) => {
  emit('month-change', month, year)
})
</script>

<style scoped>
</style>
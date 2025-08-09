<template>
  <div v-if="visible" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">Add reservation</h3>
        <button class="modal-close" @click="emit('close')">×</button>
      </div>
      <form class="modal-body" @submit.prevent="submit">
        <div class="field">
          <label>Title</label>
          <input v-model="title" type="text" required />
        </div>
        <div class="grid-3">
          <div class="field">
            <label>Date</label>
            <input v-model="date" type="date" required />
          </div>
          <div class="field">
            <label>Start time</label>
            <input v-model="startTime" type="time" required />
          </div>
          <div class="field">
            <label>End time</label>
            <input v-model="endTime" type="time" :min="startTime" required />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Duration (min)</label>
            <input :value="computedDuration" type="number" readonly />
          </div>
          <div class="field">
            <label>Amount</label>
            <input v-model.number="amount" type="number" min="0" />
          </div>
        </div>
        <div class="field">
          <label>Phone</label>
          <input v-model="phone" type="tel" />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="modal-footer">
          <button type="button" class="btn" @click="emit('close')">Cancel</button>
          <button type="submit" class="btn primary" :disabled="isInvalid">Add</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Reservation } from '../types'
import { ref, computed, watch } from 'vue'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: []; submit: [payload: Reservation] }>()

const title = ref('')
const date = ref('')
const startTime = ref('09:00')
const endTime = ref('10:00')
// duration is derived from start/end; user cannot edit directly
const amount = ref<number | undefined>(undefined)
const phone = ref('')
const error = ref('')

function submit() {
  error.value = ''
  if (!date.value || !startTime.value || !endTime.value) {
    error.value = 'Please fill date and times.'
    return
  }
  const startIso = new Date(`${date.value}T${startTime.value}`).toISOString()
  const endIso = new Date(`${date.value}T${endTime.value}`).toISOString()
  if (new Date(endIso).getTime() <= new Date(startIso).getTime()) {
    error.value = 'End time must be after start time.'
    return
  }
  const computedDurationVal = Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000)
  const payload: Reservation = {
    id: Date.now().toString(),
    title: title.value,
    start_date: startIso,
    end_date: endIso,
    duration: computedDurationVal,
    amount: amount.value,
    phone: phone.value
  }
  emit('submit', payload)
  emit('close')
}

const computedDuration = computed(() => {
  if (!date.value || !startTime.value || !endTime.value) return 0
  const startMs = new Date(`${date.value}T${startTime.value}`).getTime()
  const endMs = new Date(`${date.value}T${endTime.value}`).getTime()
  const diff = endMs - startMs
  return diff > 0 ? Math.round(diff / 60000) : 0
})

const isInvalid = computed(() => {
  if (!date.value || !startTime.value || !endTime.value) return true
  const startMs = new Date(`${date.value}T${startTime.value}`).getTime()
  const endMs = new Date(`${date.value}T${endTime.value}`).getTime()
  return endMs <= startMs
})

watch([date, startTime, endTime], () => {
  error.value = ''
  if (isInvalid.value) error.value = 'End time must be after start time.'
})
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-card { width: 100%; max-width: 640px; background: #fff; border: 1px solid rgba(10,10,10,0.15); border-radius: 8px; overflow: hidden; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(10,10,10,0.15); }
.modal-title { margin: 0; font-size: 16px; font-weight: 600; }
.modal-close { background: transparent; border: 0; font-size: 20px; line-height: 1; cursor: pointer; }
.modal-body { padding: 16px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
label { color: #6b7280; font-size: 14px; }
input { border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 10px; font-size: 14px; }
.error { color: #b91c1c; font-size: 12px; margin-top: 4px; }
.modal-footer { display: flex; gap: 8px; justify-content: flex-end; padding-top: 8px; }
.btn { padding: 8px 12px; border: 1px solid rgba(10,10,10,0.15); border-radius: 6px; background: #f9fafb; cursor: pointer; }
.btn:hover { background: #f3f4f6; }
.btn.primary { background: #111827; color: #f9fafb; border-color: #111827; }
.btn.primary:hover { opacity: 0.9; }
@media (max-width: 640px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }
</style>



<template>
  <div v-if="visible" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">Reservation details</h3>
        <button class="modal-close" @click="emit('close')">×</button>
      </div>
      <div class="modal-body" v-if="reservation">
        <div class="row">
          <span class="label">Title</span>
          <span class="value">{{ reservation.title }}</span>
        </div>
        <div class="row">
          <span class="label">Start</span>
          <span class="value">{{ formatDateTime(reservation.start_date) }}</span>
        </div>
        <div class="row">
          <span class="label">End</span>
          <span class="value">{{ formatDateTime(reservation.end_date) }}</span>
        </div>
        <div class="grid">
          <div class="row">
            <span class="label">Duration</span>
            <span class="value">{{ reservation.duration }} min</span>
          </div>
          <div class="row" v-if="reservation.amount !== undefined">
            <span class="label">Amount</span>
            <span class="value">{{ reservation.amount }}</span>
          </div>
          <div class="row" v-if="reservation.phone">
            <span class="label">Phone</span>
            <span class="value">{{ reservation.phone }}</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" @click="emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Reservation } from '../types'

const props = defineProps<{ visible: boolean; reservation: Reservation | null; locale?: string }>()
const emit = defineEmits<{ close: [] }>()

function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleString(props.locale || 'en-US')
  } catch {
    return value
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-card {
  width: 100%;
  max-width: 560px;
  background: #ffffff;
  border: 1px solid rgba(10, 10, 10, 0.15);
  border-radius: 8px;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(10, 10, 10, 0.15);
}
.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}
.modal-close {
  background: transparent;
  border: 0;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}
.modal-body {
  padding: 16px;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}
.label {
  color: #6b7280;
  font-size: 14px;
}
.value {
  color: #111827;
  font-size: 14px;
  font-weight: 600;
}
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
}
.modal-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(10, 10, 10, 0.15);
  display: flex;
  justify-content: flex-end;
}
.btn {
  padding: 8px 12px;
  border: 1px solid rgba(10, 10, 10, 0.15);
  border-radius: 6px;
  background: #f9fafb;
  cursor: pointer;
}
.btn:hover { background: #f3f4f6; }
</style>



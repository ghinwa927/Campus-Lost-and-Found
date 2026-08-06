<template>
  <div v-if="item" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div class="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl animate-fade-in">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <span
            :class="[
              'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white',
              item.type === 'LOST' ? 'bg-slate-900' : 'bg-blue-600'
            ]"
          >
            {{ item.type }}
          </span>
          <span class="text-xs font-bold text-slate-400">ID: {{ item.id }}</span>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer">✕</button>
      </div>

      <div class="mt-4 space-y-4">
        <div class="h-64 bg-slate-100 rounded-2xl overflow-hidden relative">
          <img :src="item.imageUrl" :alt="item.title" class="w-full h-full object-cover" />
        </div>

        <div>
          <h2 class="text-xl font-bold text-slate-900">{{ item.title }}</h2>
          <p class="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>📍 {{ item.building }} ({{ item.faculty }})</span>
            <span>•</span>
            <span>📅 {{ item.date }}</span>
          </p>
        </div>

        <!-- STATUS TOGGLE / ACTION CARD -->
        <div class="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700">Report Status:</span>
            <span
              :class="[
                'px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase',
                item.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                item.status === 'IN_CLAIM' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                'bg-slate-200 text-slate-700 border border-slate-300'
              ]"
            >
              {{ item.status.replace(/_/g, ' ') }}
            </span>
          </div>

          <div class="flex items-center gap-2 flex-wrap pt-2 border-t border-blue-100">
            <span class="text-[11px] text-slate-600 font-semibold">Change Status:</span>
            <button
              v-if="item.status !== 'ACTIVE'"
              @click="onUpdateStatus(item.id, 'ACTIVE')"
              class="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              Set Active
            </button>
            <button
              v-if="item.status !== 'IN_CLAIM'"
              @click="onUpdateStatus(item.id, 'IN_CLAIM')"
              class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              In Claim
            </button>
            <button
              v-if="item.status !== 'FOUND_BY_OWNER'"
              @click="onUpdateStatus(item.id, 'FOUND_BY_OWNER')"
              class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              Found by Owner
            </button>
            <button
              v-if="item.status !== 'RETURNED_TO_OWNER'"
              @click="onUpdateStatus(item.id, 'RETURNED_TO_OWNER')"
              class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              Returned to Owner
            </button>
          </div>
        </div>

        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <p class="text-xs font-bold text-slate-700 uppercase">Exact Spot Description</p>
          <p class="text-xs text-slate-600 leading-relaxed">{{ item.description }}</p>
        </div>

        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <p class="text-xs font-bold text-slate-700 uppercase">Reporter Contact Info</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            <p><strong>Name:</strong> {{ item.reporterName || 'Campus Member' }}</p>
            <p><strong>Phone:</strong> {{ item.reporterPhone || 'Not provided' }}</p>
            <p><strong>Email:</strong> {{ item.reporterEmail || 'Not provided' }}</p>
            <p><strong>Security Station:</strong> {{ item.securityPost || 'Main Security' }}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
        >
          Close
        </button>
        <button
          @click="$emit('startClaim', item)"
          class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Submit Claim Form
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CampusItem, ItemStatus } from '~/types'

defineProps<{
  item: CampusItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'startClaim', item: CampusItem): void
}>()

const { updateStatus } = useCampusItems()

const onUpdateStatus = (id: string, status: ItemStatus) => {
  updateStatus(id, status)
}
</script>

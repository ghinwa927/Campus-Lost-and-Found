<template>
  <div
    @click="$emit('select', item)"
    class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col cursor-pointer"
  >
    <div class="h-44 bg-slate-100 relative overflow-hidden shrink-0">
      <img
        :src="item.imageUrl"
        :alt="item.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div class="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
        <span
          :class="[
            'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xs',
            item.type === 'LOST' ? 'bg-slate-900' : 'bg-blue-600'
          ]"
        >
          {{ item.type }}
        </span>

        <span
          v-if="item.status === 'IN_CLAIM'"
          class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-xs"
        >
          IN CLAIM
        </span>
        <span
          v-else-if="item.status === 'FOUND_BY_OWNER' || item.status === 'RETURNED_TO_OWNER' || item.status === 'RECONNECTED'"
          class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-xs"
        >
          RESOLVED
        </span>
      </div>

      <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-medium text-white">
        <span class="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
          📍 {{ item.building }}
        </span>
        <span class="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
          {{ item.date }}
        </span>
      </div>
    </div>

    <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
      <div>
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
            {{ item.category }}
          </span>
          <span class="text-[10px] text-slate-400 font-medium">Faculty: {{ item.faculty }}</span>
        </div>
        <h3 class="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {{ item.title }}
        </h3>
        <p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {{ item.description || 'No detailed description provided.' }}
        </p>
      </div>

      <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-1.5 text-xs text-slate-600">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="truncate max-w-[140px] font-medium">{{ item.location }}</span>
        </div>
        <button
          @click.stop="$emit('select', item)"
          class="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
        >
          View Details →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CampusItem } from '~/types'

defineProps<{
  item: CampusItem
}>()

defineEmits<{
  (e: 'select', item: CampusItem): void
}>()
</script>

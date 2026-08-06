<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <!-- PAGE HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">My Reported Items</h1>
        <p class="text-xs text-slate-500 mt-0.5">Manage and update the status of item reports posted by you.</p>
      </div>

      <NuxtLink
        to="/report"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
      >
        <span>+ Report New Item</span>
      </NuxtLink>
    </div>

    <!-- STATUS TABS -->
    <StatusTabs
      :current="statusFilter"
      :tabs="[
        { value: 'ALL', label: 'All My Items', count: myItems.length, activeClass: 'bg-slate-900 text-white shadow-xs', inactiveClass: 'text-slate-600 hover:bg-slate-100' },
        { value: 'ACTIVE', label: 'Active', count: activeCount, activeClass: 'bg-emerald-600 text-white shadow-xs', inactiveClass: 'text-slate-600 hover:bg-slate-100' },
        { value: 'IN_CLAIM', label: 'In Claim Process', count: claimCount, activeClass: 'bg-amber-500 text-white shadow-xs', inactiveClass: 'text-slate-600 hover:bg-slate-100' },
        { value: 'RESOLVED', label: 'Resolved', count: resolvedCount, activeClass: 'bg-blue-600 text-white shadow-xs', inactiveClass: 'text-slate-600 hover:bg-slate-100' }
      ]"
      @update="statusFilter = $event as typeof statusFilter.value"
    />

    <!-- LIST OF USER ITEMS -->
    <div v-if="filteredMyItems.length > 0" class="space-y-4">
      <div
        v-for="item in filteredMyItems"
        :key="item.id"
        class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
            <img :src="item.imageUrl" :alt="item.title" class="w-full h-full object-cover" />
          </div>

          <div class="space-y-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white',
                  item.type === 'LOST' ? 'bg-slate-900' : 'bg-blue-600'
                ]"
              >
                {{ item.type }}
              </span>
              <span class="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                {{ item.category }}
              </span>
              <span class="text-[10px] text-slate-400 font-medium">Posted: {{ item.date }}</span>
            </div>

            <h3 class="font-bold text-sm text-slate-900 truncate">{{ item.title }}</h3>
            <p class="text-xs text-slate-500 truncate">📍 {{ item.location }} ({{ item.building }})</p>
          </div>
        </div>

        <!-- ACTIONS & STATUS CONTROLS -->
        <div class="flex flex-col sm:items-end gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-slate-400 font-semibold">Status:</span>
            <select
              :value="item.status"
              @change="onStatusSelect(item.id, ($event.target as HTMLSelectElement).value as ItemStatus)"
              class="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-extrabold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="IN_CLAIM">IN CLAIM</option>
              <option value="FOUND_BY_OWNER">FOUND BY OWNER</option>
              <option value="RETURNED_TO_OWNER">RETURNED TO OWNER</option>
              <option value="RECONNECTED">RECONNECTED</option>
            </select>
          </div>

          <button
            @click="selectedItem = item"
            class="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Details</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div v-else class="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
      <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl">📋</div>
      <h3 class="text-base font-bold text-slate-900">No items match this status</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">Items you report or post will appear here for status tracking and updates.</p>
      <NuxtLink
        to="/report"
        class="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
      >
        + Report an Item Now
      </NuxtLink>
    </div>

    <!-- MODALS -->
    <ItemDetailModal
      :item="selectedItem"
      @close="selectedItem = null"
      @startClaim="onStartClaim"
    />
    <ClaimModal
      :item="claimingItem"
      @close="claimingItem = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { CampusItem, ItemStatus } from '~/types'
import StatusTabs from '~/components/StatusTabs.vue'

useHead({
  title: 'My Reported Items - Campus Lost & Found Portal'
})

const { items, selectedItem, claimingItem, updateStatus } = useCampusItems()

const statusFilter = ref<'ALL' | 'ACTIVE' | 'IN_CLAIM' | 'RESOLVED'>('ALL')

const myItems = computed(() => items.value)

const activeCount = computed(() => myItems.value.filter(i => i.status === 'ACTIVE').length)
const claimCount = computed(() => myItems.value.filter(i => i.status === 'IN_CLAIM').length)
const resolvedCount = computed(() => myItems.value.filter(i => i.status !== 'ACTIVE' && i.status !== 'IN_CLAIM').length)

const filteredMyItems = computed(() => {
  if (statusFilter.value === 'ACTIVE') return myItems.value.filter(i => i.status === 'ACTIVE')
  if (statusFilter.value === 'IN_CLAIM') return myItems.value.filter(i => i.status === 'IN_CLAIM')
  if (statusFilter.value === 'RESOLVED') return myItems.value.filter(i => i.status !== 'ACTIVE' && i.status !== 'IN_CLAIM')
  return myItems.value
})

const onStatusSelect = (id: string, newStatus: ItemStatus) => {
  updateStatus(id, newStatus)
}

const onStartClaim = (item: CampusItem) => {
  selectedItem.value = null
  claimingItem.value = item
}
</script>
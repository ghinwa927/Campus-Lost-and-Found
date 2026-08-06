<template>
  <div class="space-y-6">
    <!-- HERO STATS / SEARCH HEADER -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Campus Lost & Found Directory</h1>
          <p class="text-xs text-slate-500 mt-1">Browse, report, and claim items lost across university buildings and faculties.</p>
        </div>
        <NuxtLink
          to="/report"
          class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all shrink-0 self-start md:self-auto cursor-pointer"
        >
          <span>+ Report New Item</span>
        </NuxtLink>
      </div>

      <!-- SEARCH INPUTS -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div class="md:col-span-8 relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search items by keyword, title, location or description..."
            class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 transition-colors"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <div class="md:col-span-4">
          <select
            v-model="selectedCategory"
            class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option v-for="cat in INITIAL_CATEGORIES" :key="cat.id" :value="cat.name">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- FILTER DROPDOWNS -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Building</label>
          <select v-model="selectedBuilding" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none">
            <option v-for="bldg in INITIAL_BUILDINGS" :key="bldg" :value="bldg">{{ bldg }}</option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Faculty</label>
          <select v-model="selectedFaculty" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none">
            <option v-for="fac in INITIAL_FACULTIES" :key="fac" :value="fac">{{ fac }}</option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Timeframe</label>
          <select v-model="selectedTimeframe" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none">
            <option v-for="tf in INITIAL_TIMEFRAMES" :key="tf" :value="tf">{{ tf }}</option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sort By</label>
          <select v-model="sortBy" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none">
            <option value="Newest First">Newest First</option>
            <option value="Oldest First">Oldest First</option>
            <option value="Title A-Z">Title A-Z</option>
          </select>
        </div>
      </div>
    </div>

    <!-- TYPE FILTER TABS & COUNT -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200/80">
        <button
          @click="typeFilter = 'ALL'"
          :class="['px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer', typeFilter === 'ALL' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900']"
        >
          All Reports ({{ filteredItems.length }})
        </button>
        <button
          @click="typeFilter = 'LOST'"
          :class="['px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer', typeFilter === 'LOST' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900']"
        >
          🔍 Lost Items
        </button>
        <button
          @click="typeFilter = 'FOUND'"
          :class="['px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer', typeFilter === 'FOUND' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900']"
        >
          📦 Found Items
        </button>
      </div>

      <p class="text-xs text-slate-500 font-semibold">
        Showing {{ displayedItems.length }} of {{ filteredItems.length }} items
      </p>
    </div>

    <!-- ITEMS GRID -->
    <div v-if="displayedItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <ItemCard
        v-for="item in displayedItems"
        :key="item.id"
        :item="item"
        @select="selectedItem = item"
      />
    </div>

    <!-- EMPTY STATE -->
    <div v-else class="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
      <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl">🔍</div>
      <h3 class="text-base font-bold text-slate-900">No matching items found</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">Try resetting filters or clearing your search term to see all campus lost & found reports.</p>
      <button
        @click="resetFilters"
        class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
      >
        Reset All Filters
      </button>
    </div>

    <!-- LOAD MORE BUTTON -->
    <div v-if="filteredItems.length > displayCount" class="text-center pt-4">
      <button
        @click="displayCount += 6"
        class="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-2xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
      >
        Load More Items
      </button>
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
import type { CampusItem } from '~/types'

useHead({
  title: 'Home - Campus Lost & Found Portal'
})

const { items, selectedItem, claimingItem } = useCampusItems()

const searchQuery = ref('')
const selectedCategory = ref('All Categories')
const selectedBuilding = ref('Select Building')
const selectedFaculty = ref('Select Faculty')
const selectedTimeframe = ref('Any Time')
const typeFilter = ref<'ALL' | 'LOST' | 'FOUND'>('ALL')
const sortBy = ref('Newest First')
const displayCount = ref(6)

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'All Categories'
  selectedBuilding.value = 'Select Building'
  selectedFaculty.value = 'Select Faculty'
  selectedTimeframe.value = 'Any Time'
  typeFilter.value = 'ALL'
  sortBy.value = 'Newest First'
}

const filteredItems = computed(() => {
  return items.value.filter(item => {
    // Type filter
    if (typeFilter.value !== 'ALL' && item.type !== typeFilter.value) return false

    // Search query
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase()
      const matchesTitle = item.title.toLowerCase().includes(q)
      const matchesDesc = (item.description || '').toLowerCase().includes(q)
      const matchesLoc = item.location.toLowerCase().includes(q)
      const matchesCat = item.category.toLowerCase().includes(q)
      if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesCat) return false
    }

    // Category filter
    if (selectedCategory.value !== 'All Categories' && item.category !== selectedCategory.value) {
      return false
    }

    // Building filter
    if (selectedBuilding.value !== 'Select Building' && item.building !== selectedBuilding.value) {
      return false
    }

    // Faculty filter
    if (selectedFaculty.value !== 'Select Faculty' && item.faculty !== selectedFaculty.value) {
      return false
    }

    return true
  }).sort((a, b) => {
    if (sortBy.value === 'Title A-Z') {
      return a.title.localeCompare(b.title)
    }
    if (sortBy.value === 'Oldest First') {
      return a.id.localeCompare(b.id)
    }
    return b.id.localeCompare(a.id)
  })
})

const displayedItems = computed(() => {
  return filteredItems.value.slice(0, displayCount.value)
})

const onStartClaim = (item: CampusItem) => {
  selectedItem.value = null
  claimingItem.value = item
}
</script>

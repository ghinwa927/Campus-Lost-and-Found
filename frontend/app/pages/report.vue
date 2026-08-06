<template>
  <div class="space-y-6 max-w-3xl mx-auto">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Report Lost or Found Item</h1>
        <p class="text-xs text-slate-500 mt-0.5">Log a lost or found item with full contact information and campus location.</p>
      </div>
      <NuxtLink
        to="/"
        class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200 shrink-0 self-start sm:self-auto cursor-pointer"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        <span>Back to Home</span>
      </NuxtLink>
    </div>

    <!-- Form Container Card -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
      <div
        v-if="hasAttemptedReportSubmit && !isReportFormValid"
        role="alert"
        aria-live="polite"
        class="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-start gap-3 animate-fade-in"
      >
        <svg class="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div>
          <p class="font-bold text-sm">Cannot Post Report</p>
          <p class="text-xs text-rose-600 mt-0.5">Please correct the {{ Object.keys(reportErrors).length }} highlighted field(s) below before submitting.</p>
        </div>
      </div>

      <!-- Generic submit error (e.g. future API failure) -->
      <div
        v-if="submitError"
        role="alert"
        aria-live="assertive"
        class="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-start gap-3 animate-fade-in"
      >
        <svg class="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div>
          <p class="font-bold text-sm">Could Not Submit Report</p>
          <p class="text-xs text-rose-600 mt-0.5">{{ submitError }}</p>
        </div>
      </div>

      <form @submit.prevent="handleAddReport" class="space-y-6" novalidate>
        <fieldset :disabled="isSubmitting" class="space-y-6">
          <div>
            <label id="report-type-label" class="block text-xs font-bold text-slate-700 uppercase mb-2">Report Type *</label>
            <div role="group" aria-labelledby="report-type-label" class="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                @click="reportType = 'LOST'"
                :aria-pressed="reportType === 'LOST'"
                :class="['py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer', reportType === 'LOST' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900']"
              >
                🔍 LOST ITEM
              </button>
              <button
                type="button"
                @click="reportType = 'FOUND'"
                :aria-pressed="reportType === 'FOUND'"
                :class="['py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer', reportType === 'FOUND' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900']"
              >
                📦 FOUND ITEM
              </button>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label for="title" class="block text-xs font-bold text-slate-700 uppercase">Item Title *</label>
              <span class="flex items-center gap-2">
                <span class="text-[10px] text-slate-400">{{ reportForm.title.length }}/{{ TITLE_MAX_LENGTH }}</span>
                <span v-if="reportTouched.title && !reportErrors.title" class="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  ✓ Valid
                </span>
              </span>
            </div>
            <input
              id="title"
              type="text"
              v-model="reportForm.title"
              @blur="reportTouched.title = true"
              :maxlength="TITLE_MAX_LENGTH"
              placeholder="e.g., Silver MacBook Pro 14&quot; or Black Leather Wallet"
              :aria-invalid="reportTouched.title && !!reportErrors.title"
              :aria-describedby="reportErrors.title ? 'title-error' : undefined"
              :class="[
                'w-full p-3 bg-slate-50 border rounded-xl text-xs focus:outline-none transition-all',
                reportTouched.title && reportErrors.title ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20' :
                reportTouched.title && !reportErrors.title ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 focus:border-blue-500'
              ]"
            />
            <p v-if="reportTouched.title && reportErrors.title" id="title-error" role="alert" class="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
              <span>⚠️</span> {{ reportErrors.title }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="category" class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Category *</label>
              <select id="category" v-model="reportForm.category" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500">
                <option v-for="cat in INITIAL_CATEGORIES.filter(c => c.id !== 'ALL')" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label for="building" class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Building *</label>
              <select id="building" v-model="reportForm.building" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500">
                <option v-for="bldg in INITIAL_BUILDINGS.filter(b => b !== 'Select Building')" :key="bldg" :value="bldg">
                  {{ bldg }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="faculty" class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Faculty *</label>
              <select id="faculty" v-model="reportForm.faculty" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500">
                <option v-for="fac in INITIAL_FACULTIES.filter(f => f !== 'Select Faculty')" :key="fac" :value="fac">
                  {{ fac }}
                </option>
              </select>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label for="location" class="block text-xs font-bold text-slate-700 uppercase">Exact Location *</label>
                <span v-if="reportTouched.location && !reportErrors.location" class="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  ✓ Valid
                </span>
              </div>
              <input
                id="location"
                type="text"
                v-model="reportForm.location"
                @blur="reportTouched.location = true"
                placeholder="e.g., Level 3, Table 12 near quiet zone"
                :aria-invalid="reportTouched.location && !!reportErrors.location"
                :aria-describedby="reportErrors.location ? 'location-error' : undefined"
                :class="[
                  'w-full p-3 bg-slate-50 border rounded-xl text-xs focus:outline-none transition-all',
                  reportTouched.location && reportErrors.location ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20' :
                  reportTouched.location && !reportErrors.location ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 focus:border-blue-500'
                ]"
              />
              <p v-if="reportTouched.location && reportErrors.location" id="location-error" role="alert" class="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                <span>⚠️</span> {{ reportErrors.location }}
              </p>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label for="description" class="block text-xs font-bold text-slate-700 uppercase">Item Description *</label>
              <span class="text-[10px] text-slate-400">
                {{ reportForm.description.length }}/{{ DESCRIPTION_MAX_LENGTH }} (10 min)
              </span>
            </div>
            <textarea
              id="description"
              rows="4"
              v-model="reportForm.description"
              @blur="reportTouched.description = true"
              :maxlength="DESCRIPTION_MAX_LENGTH"
              placeholder="Describe distinguishing features, brand, stickers, color, case type..."
              :aria-invalid="reportTouched.description && !!reportErrors.description"
              :aria-describedby="reportErrors.description ? 'description-error' : undefined"
              :class="[
                'w-full p-3 bg-slate-50 border rounded-xl text-xs focus:outline-none transition-all',
                reportTouched.description && reportErrors.description ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20' :
                reportTouched.description && !reportErrors.description ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 focus:border-blue-500'
              ]"
            ></textarea>
            <p v-if="reportTouched.description && reportErrors.description" id="description-error" role="alert" class="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
              <span>⚠️</span> {{ reportErrors.description }}
            </p>
          </div>

          <div class="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-4">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h3 class="text-xs font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Reporter Contact Details
              </h3>
              <button
                type="button"
                @click="autoFillContact"
                class="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Auto-fill My Profile Info
              </button>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="reporterName" class="block text-[10px] font-bold text-slate-600 uppercase">Person Name *</label>
                <span v-if="reportTouched.reporterName && !reportErrors.reporterName" class="text-[10px] text-emerald-600 font-bold">
                  ✓ Valid
                </span>
              </div>
              <input
                id="reporterName"
                type="text"
                v-model="reportForm.reporterName"
                @blur="reportTouched.reporterName = true"
                placeholder="e.g. Alex Rivera"
                :aria-invalid="reportTouched.reporterName && !!reportErrors.reporterName"
                :aria-describedby="reportErrors.reporterName ? 'reporterName-error' : undefined"
                :class="[
                  'w-full p-2.5 bg-white border rounded-xl text-xs focus:outline-none transition-all',
                  reportTouched.reporterName && reportErrors.reporterName ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20' :
                  reportTouched.reporterName && !reportErrors.reporterName ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 focus:border-blue-500'
                ]"
              />
              <p v-if="reportTouched.reporterName && reportErrors.reporterName" id="reporterName-error" role="alert" class="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                <span>⚠️</span> {{ reportErrors.reporterName }}
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label for="reporterPhone" class="block text-[10px] font-bold text-slate-600 uppercase">Phone Number *</label>
                  <span v-if="reportTouched.reporterPhone && !reportErrors.reporterPhone" class="text-[10px] text-emerald-600 font-bold">
                    ✓ Valid
                  </span>
                </div>
                <input
                  id="reporterPhone"
                  type="tel"
                  v-model="reportForm.reporterPhone"
                  @blur="reportTouched.reporterPhone = true"
                  placeholder="e.g. +1 (555) 019-2831"
                  :aria-invalid="reportTouched.reporterPhone && !!reportErrors.reporterPhone"
                  :aria-describedby="reportErrors.reporterPhone ? 'reporterPhone-error' : undefined"
                  :class="[
                    'w-full p-2.5 bg-white border rounded-xl text-xs focus:outline-none transition-all',
                    reportTouched.reporterPhone && reportErrors.reporterPhone ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20' :
                    reportTouched.reporterPhone && !reportErrors.reporterPhone ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 focus:border-blue-500'
                  ]"
                />
                <p v-if="reportTouched.reporterPhone && reportErrors.reporterPhone" id="reporterPhone-error" role="alert" class="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <span>⚠️</span> {{ reportErrors.reporterPhone }}
                </p>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label for="reporterEmail" class="block text-[10px] font-bold text-slate-600 uppercase">Email Address *</label>
                  <span v-if="reportTouched.reporterEmail && !reportErrors.reporterEmail" class="text-[10px] text-emerald-600 font-bold">
                    ✓ Valid
                  </span>
                </div>
                <input
                  id="reporterEmail"
                  type="email"
                  v-model="reportForm.reporterEmail"
                  @blur="reportTouched.reporterEmail = true"
                  placeholder="e.g. alex.r@university.edu"
                  :aria-invalid="reportTouched.reporterEmail && !!reportErrors.reporterEmail"
                  :aria-describedby="reportErrors.reporterEmail ? 'reporterEmail-error' : undefined"
                  :class="[
                    'w-full p-2.5 bg-white border rounded-xl text-xs focus:outline-none transition-all',
                    reportTouched.reporterEmail && reportErrors.reporterEmail ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20' :
                    reportTouched.reporterEmail && !reportErrors.reporterEmail ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 focus:border-blue-500'
                  ]"
                />
                <p v-if="reportTouched.reporterEmail && reportErrors.reporterEmail" id="reporterEmail-error" role="alert" class="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <span>⚠️</span> {{ reportErrors.reporterEmail }}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label id="image-upload-label" class="block text-xs font-bold text-slate-700 uppercase mb-2">Item Image Upload *</label>

            <input
              type="file"
              ref="fileInputRef"
              accept="image/*"
              class="hidden"
              aria-hidden="true"
              tabindex="-1"
              @change="handleFileUpload"
            />

            <!-- Uploaded Preview State -->
            <div v-if="reportForm.imageUrl" class="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group max-w-md mx-auto sm:mx-0">
              <img :src="reportForm.imageUrl" class="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="Uploaded item preview" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end justify-between p-3">
                <span class="text-xs font-semibold text-white bg-slate-900/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Image Attached
                </span>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="triggerFileInput"
                    class="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    @click="removeImage"
                    aria-label="Remove uploaded image"
                    class="px-2.5 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    title="Remove Image"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty Drag & Drop Upload Zone -->
            <div
              v-else
              role="button"
              tabindex="0"
              aria-labelledby="image-upload-label"
              @click="triggerFileInput"
              @keydown.enter="triggerFileInput"
              @keydown.space.prevent="triggerFileInput"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              :class="[
                'border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2',
                isDragging ? 'border-blue-500 bg-blue-50/50 scale-[0.99]' : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/20'
              ]"
            >
              <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold text-slate-800">
                  Click to upload photo <span class="font-normal text-slate-500">or drag and drop</span>
                </p>
                <p class="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP or GIF up to 10MB</p>
              </div>
            </div>
            <p v-if="reportTouched.image && reportErrors.image" id="image-error" role="alert" class="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
              <span>⚠️</span> {{ reportErrors.image }}
            </p>

            <!-- Optional Preset Samples link -->
            <div class="mt-3 flex items-center justify-between">
              <button
                type="button"
                @click="showPresets = !showPresets"
                :aria-expanded="showPresets"
                aria-controls="preset-images-panel"
                class="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{{ showPresets ? 'Hide sample preset images' : 'Or choose from sample preset images' }}</span>
                <svg class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': showPresets }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>

            <!-- Preset Images Dropdown/Collapsible -->
            <div v-if="showPresets" id="preset-images-panel" class="mt-2 grid grid-cols-4 sm:grid-cols-8 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <button
                v-for="(img, idx) in PRESET_IMAGES"
                :key="idx"
                type="button"
                @click="reportForm.imageUrl = img.url"
                :aria-label="`Use ${img.name} sample image`"
                :aria-pressed="reportForm.imageUrl === img.url"
                :class="[
                  'h-16 rounded-xl overflow-hidden border-2 transition-all relative group cursor-pointer',
                  reportForm.imageUrl === img.url ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105' : 'border-slate-200 hover:border-slate-300'
                ]"
              >
                <img :src="img.url" class="w-full h-full object-cover" :alt="img.name" />
                <span class="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] truncate px-1 py-0.5 text-center font-medium">
                  {{ img.name }}
                </span>
              </button>
            </div>
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <NuxtLink
              to="/"
              class="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </NuxtLink>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg v-if="isSubmitting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Submitting...' : 'Submit Item Report' }}</span>
              <svg v-if="!isSubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ItemType, CampusItem } from '~/types'

useHead({
  title: 'Report Item - Campus Lost & Found Portal'
})

const router = useRouter()
const { addItem } = useCampusItems()

const TITLE_MAX_LENGTH = 80
const DESCRIPTION_MAX_LENGTH = 500
// Loose but sane phone check: requires at least 7 digits, allows +, spaces, dashes, parens
const PHONE_REGEX = /^[+()\d\s-]{7,20}$/

const reportType = ref<ItemType>('LOST')
const hasAttemptedReportSubmit = ref(false)
const isSubmitting = ref(false)
const submitError = ref('')

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const showPresets = ref(false)

const reportForm = reactive({
  title: '',
  category: 'ELECTRONICS',
  building: 'Central Library',
  faculty: 'General Studies',
  location: '',
  description: '',
  imageUrl: '',
  reporterName: '',
  reporterPhone: '',
  reporterEmail: ''
})

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    processFile(target.files[0])
  }
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    processFile(e.dataTransfer.files[0])
  }
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10MB, matches the UI copy

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Please upload a valid image file (PNG, JPG, WEBP, GIF)')
    return
  }
  if (file.size > MAX_IMAGE_BYTES) {
    alert('Image is too large. Please upload a file under 10MB.')
    return
  }
  const reader = new FileReader()
  reader.onload = (event) => {
    if (event.target?.result) {
      reportForm.imageUrl = event.target.result as string
    }
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  reportForm.imageUrl = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const reportTouched = reactive({
  title: false,
  location: false,
  description: false,
  reporterName: false,
  reporterPhone: false,
  reporterEmail: false,
  image: false
})

const PRESET_IMAGES = [
  { name: 'Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' },
  { name: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
  { name: 'Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80' },
  { name: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Book', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
  { name: 'Keys', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80' },
  { name: 'Phone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80' },
  { name: 'ID Card', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80' }
]

const autoFillContact = () => {
  reportForm.reporterName = 'Alex Rivera'
  reportForm.reporterPhone = '+1 (555) 234-5678'
  reportForm.reporterEmail = 'alex.r@university.edu'
  reportTouched.reporterName = true
  reportTouched.reporterPhone = true
  reportTouched.reporterEmail = true
}

const reportErrors = computed(() => {
  const errors: Record<string, string> = {}
  const title = reportForm.title.trim()
  if (!title) {
    errors.title = 'Title is required (min 3 chars)'
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters'
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be under ${TITLE_MAX_LENGTH} characters`
  }

  if (!reportForm.location.trim()) {
    errors.location = 'Exact location is required'
  }

  const description = reportForm.description.trim()
  if (!description) {
    errors.description = 'Item description is required'
  } else if (description.length < 10) {
    errors.description = 'Description must be at least 10 characters'
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be under ${DESCRIPTION_MAX_LENGTH} characters`
  }

  if (!reportForm.reporterName.trim()) {
    errors.reporterName = 'Reporter name is required'
  }

  const phone = reportForm.reporterPhone.trim()
  if (!phone) {
    errors.reporterPhone = 'Phone number is required'
  } else if (!PHONE_REGEX.test(phone)) {
    errors.reporterPhone = 'Enter a valid phone number'
  }

  if (!reportForm.reporterEmail.trim()) {
    errors.reporterEmail = 'Email address is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reportForm.reporterEmail.trim())) {
    errors.reporterEmail = 'Valid email address is required'
  }

  if (!reportForm.imageUrl) {
    errors.image = 'Please upload or select an item image'
  }

  return errors
})

const isReportFormValid = computed(() => Object.keys(reportErrors.value).length === 0)

const handleAddReport = async () => {
  hasAttemptedReportSubmit.value = true
  submitError.value = ''
  reportTouched.title = true
  reportTouched.location = true
  reportTouched.description = true
  reportTouched.reporterName = true
  reportTouched.reporterPhone = true
  reportTouched.reporterEmail = true
  reportTouched.image = true

  if (!isReportFormValid.value || isSubmitting.value) return

  isSubmitting.value = true

  try {
    const defaultImage = PRESET_IMAGES.find(img => img.name.toLowerCase().includes(reportForm.category.toLowerCase()))?.url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'

    const newItem: CampusItem = {
      id: `report-${Date.now()}`,
      title: reportForm.title.trim(),
      type: reportType.value,
      category: reportForm.category,
      building: reportForm.building,
      faculty: reportForm.faculty,
      location: reportForm.location.trim(),
      date: 'Just now',
      imageUrl: reportForm.imageUrl || defaultImage,
      description: reportForm.description.trim(),
      reporterName: reportForm.reporterName.trim(),
      reporterPhone: reportForm.reporterPhone.trim(),
      reporterEmail: reportForm.reporterEmail.trim(),
      reporterContact: reportForm.reporterEmail.trim(),
      status: 'ACTIVE',
      securityPost: `${reportForm.building} Security Office`
    }

    // NOTE: still local-state only (useState). Swap this for an awaited
    // POST to /api/items once the backend is wired up, and only navigate
    // on a successful response.
    addItem(newItem)
    router.push('/reported-items')
  } catch (err) {
    submitError.value = 'Something went wrong while submitting your report. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

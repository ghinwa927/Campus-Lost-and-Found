<template>
  <div v-if="item" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl animate-fade-in">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Submit Ownership Claim</h2>
          <p class="text-xs text-slate-500 mt-0.5">Claiming: {{ item.title }}</p>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer">✕</button>
      </div>

      <div v-if="submitted" class="py-8 text-center space-y-3">
        <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto font-black text-xl">
          ✓
        </div>
        <h3 class="text-base font-bold text-slate-900">Claim Request Transmitted!</h3>
        <p class="text-xs text-slate-600 max-w-sm mx-auto">
          Your details and serial/identifier proof have been sent to Campus Security at <strong>{{ item.securityPost || 'Main Security Office' }}</strong>.
        </p>
        <button
          @click="onFinish"
          class="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          Done
        </button>
      </div>

      <form v-else @submit.prevent="handleSubmitClaim" class="mt-4 space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name *</label>
          <input
            type="text"
            required
            v-model="claimForm.name"
            placeholder="e.g., Alex Rivera"
            class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Student / Staff ID *</label>
            <input
              type="text"
              required
              v-model="claimForm.studentId"
              placeholder="e.g., STU-99201"
              class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              v-model="claimForm.phone"
              placeholder="+1 (555) 000-0000"
              class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Proof of Ownership / Identifiers *</label>
          <textarea
            required
            rows="3"
            v-model="claimForm.proof"
            placeholder="Describe serial numbers, lock screen wallpaper, specific contents, or purchase receipts..."
            class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>

        <div class="pt-3 flex justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            Submit Ownership Claim
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CampusItem } from '~/types'

const props = defineProps<{
  item: CampusItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { updateStatus } = useCampusItems()

const submitted = ref(false)
const claimForm = reactive({
  name: 'Alex Rivera',
  studentId: 'STU-88204',
  phone: '+1 (555) 234-5678',
  proof: ''
})

const handleSubmitClaim = () => {
  if (props.item) {
    updateStatus(props.item.id, 'IN_CLAIM')
  }
  submitted.value = true
}

const onFinish = () => {
  submitted.value = false
  emit('close')
}
</script>

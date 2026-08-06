<template>
  <div class="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 flex-wrap">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      @click="$emit('update', tab.value)"
      :class="[
        'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer',
        current === tab.value ? tab.activeClass : tab.inactiveClass
      ]"
    >
      {{ tab.label }} ({{ tab.count }})
    </button>
  </div>
</template>

<script setup lang="ts">
interface StatusTab {
  value: string
  label: string
  count: number
  activeClass: string
  inactiveClass: string
}

defineProps<{
  current: string
  tabs: StatusTab[]
}>()

defineEmits<{
  update: [value: string]
}>()
</script>
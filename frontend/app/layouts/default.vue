<template>
  <div class="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col antialiased">
    <!-- TOP NAVIGATION BAR -->
    <header class="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="flex items-center gap-2.5 group shrink-0">
            <div class="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xs font-black text-lg group-hover:bg-blue-700 transition-colors">
              C
            </div>
            <div>
              <span class="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight block">Campus Portal</span>
              <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block -mt-1">Lost & Found</span>
            </div>
          </NuxtLink>

          <!-- TOP NAVIGATION BAR LINKS -->
          <nav class="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <NuxtLink
              to="/"
              active-class="bg-white text-blue-600 shadow-2xs font-extrabold"
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span>Home Page</span>
            </NuxtLink>

            <NuxtLink
              to="/report"
              active-class="bg-white text-blue-600 shadow-2xs font-extrabold"
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span>Report Item</span>
            </NuxtLink>

            <NuxtLink
              to="/reported-items"
              active-class="bg-white text-blue-600 shadow-2xs font-extrabold"
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 002 2"/>
              </svg>
              <span>Reported Items</span>
            </NuxtLink>
          </nav>
        </div>

        <!-- Quick Actions, Profile & Mobile Menu Toggle -->
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/report"
            class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span class="hidden sm:inline">Report Item</span>
          </NuxtLink>

          <div class="w-px h-6 bg-slate-200 hidden sm:block"></div>

          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs">
              AR
            </div>
            <div class="hidden lg:block text-left">
              <p class="text-xs font-bold text-slate-900 leading-tight">Alex Rivera</p>
              <p class="text-[10px] text-slate-500 leading-tight">alex.r@university.edu</p>
            </div>
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            @click="isOpenMobileMenu = !isOpenMobileMenu"
            class="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- MOBILE NAV DROPDOWN -->
      <div v-if="isOpenMobileMenu" class="md:hidden bg-white border-t border-slate-100 p-3 space-y-1">
        <NuxtLink
          to="/"
          @click="isOpenMobileMenu = false"
          active-class="bg-blue-50 text-blue-600 font-bold"
          class="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span>Home Page</span>
        </NuxtLink>
        <NuxtLink
          to="/report"
          @click="isOpenMobileMenu = false"
          active-class="bg-blue-50 text-blue-600 font-bold"
          class="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Report Item</span>
        </NuxtLink>
        <NuxtLink
          to="/reported-items"
          @click="isOpenMobileMenu = false"
          active-class="bg-blue-50 text-blue-600 font-bold"
          class="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 002 2"/>
          </svg>
          <span>Reported Items</span>
        </NuxtLink>
      </div>
    </header>

    <!-- MAIN BODY CONTAINER -->
    <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
      <main class="w-full">
        <slot />
      </main>
    </div>

    <!-- FOOTER -->
    <footer class="bg-white border-t border-slate-200/80 mt-auto py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <p class="font-medium">Campus Lost & Found System • Powered by Nuxt 3 Framework</p>
        <p class="text-[10px] text-slate-400 mt-1">For immediate security assistance, contact Campus Security at +1 (555) 019-2831.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const isOpenMobileMenu = ref(false)
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- Main Area -->
    <div class="flex-1 flex flex-col">

      <!-- Navbar -->
      <AppNavbar />

      <!-- Page Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>

      <!-- Footer -->
      <AppFooter />

    </div>

  </div>
</template>

<script setup lang="ts">
import AppNavbar from "~/components/layout/AppNavbar.vue"
import AppFooter from "~/components/layout/AppFooter.vue"
</script>
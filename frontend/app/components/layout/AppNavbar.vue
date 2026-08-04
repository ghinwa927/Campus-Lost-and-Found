<template>
  <header class="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-end sticky top-0 z-10">
    
    <!-- Action Buttons -->
    <div class="flex items-center gap-3">
      <NuxtLink
        to="/login"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-150"
      >
        <Icon name="lucide:log-in" class="w-4 h-4" />
        <span>Sign In</span>
      </NuxtLink>

      <NuxtLink
        to="/register"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-900/20 transition-all duration-150"
      >
        <Icon name="lucide:user-plus" class="w-4 h-4" />
        <span>Register</span>
      </NuxtLink>
    </div>

  </header>
</template>
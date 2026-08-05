<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import type { CampusItem, ActiveTab, ItemStatus, ItemType } from './types';
import {
  INITIAL_ITEMS,
  INITIAL_CATEGORIES,
  INITIAL_BUILDINGS,
  INITIAL_FACULTIES,
  INITIAL_TIMEFRAMES
} from './data/mockData';

// Active Tab State (dashboard = Home Page)
const activeTab = ref<ActiveTab>('dashboard');
const searchQuery = ref('');
const mainKeywordQuery = ref('');
const selectedCategory = ref('All Categories');
const selectedBuilding = ref('Select Building');
const selectedFaculty = ref('Select Faculty');
const selectedTimeframe = ref('Any Time');
const selectedStatusFilter = ref<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');
const sortBy = ref('Newest First');
const isOpenMobileSidebar = ref(false);
const displayCount = ref(6);

// Status Change Notification Toast
const statusChangeMessage = ref<string | null>(null);

// Status Helper Functions
const getStatusLabel = (item: CampusItem) => {
  if (item.status === 'FOUND_BY_OWNER') {
    return '✓ Found It! (Recovered)';
  }
  if (item.status === 'RETURNED_TO_OWNER') {
    return '✓ Returned to Owner';
  }
  if (item.status === 'RECONNECTED') {
    return '✓ Reconnected';
  }
  if (item.status === 'IN_CLAIM') {
    return 'In Claim Inquiry';
  }
  return item.type === 'LOST' ? 'Active (Still Missing)' : 'Active (At Security)';
};

const getStatusBadgeClass = (status: ItemStatus, type: ItemType) => {
  switch (status) {
    case 'FOUND_BY_OWNER':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold';
    case 'RETURNED_TO_OWNER':
      return 'bg-teal-100 text-teal-800 border-teal-300 font-extrabold';
    case 'RECONNECTED':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300 font-extrabold';
    case 'IN_CLAIM':
      return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
    case 'ACTIVE':
    default:
      return type === 'LOST'
        ? 'bg-amber-50 text-amber-700 border-amber-200/80 font-semibold'
        : 'bg-blue-50 text-blue-700 border-blue-200/80 font-semibold';
  }
};

const updateItemStatus = (item: CampusItem, newStatus: ItemStatus) => {
  item.status = newStatus;
  if (selectedItemDetail.value && selectedItemDetail.value.id === item.id) {
    selectedItemDetail.value.status = newStatus;
  }

  let text = '';
  if (newStatus === 'FOUND_BY_OWNER') {
    text = `🎉 Status updated: "${item.title}" marked as Found It (Recovered by Owner)!`;
  } else if (newStatus === 'RETURNED_TO_OWNER') {
    text = `🎁 Status updated: "${item.title}" marked as Returned to Owner!`;
  } else if (newStatus === 'RECONNECTED') {
    text = `🤝 Status updated: "${item.title}" marked as Reconnected!`;
  } else if (newStatus === 'ACTIVE') {
    text = `🔄 Status reset to Active for "${item.title}"`;
  }

  statusChangeMessage.value = text;
  setTimeout(() => {
    if (statusChangeMessage.value === text) {
      statusChangeMessage.value = null;
    }
  }, 4000);
};

// Modals State
const selectedItemDetail = ref<CampusItem | null>(null);
const isReportModalOpen = ref(false);
const showNotifications = ref(false);

// Dataset State
const items = ref<CampusItem[]>([...INITIAL_ITEMS]);

// ==========================================
// FORM VALIDATION & STATE: REPORT ITEM
// ==========================================
const reportType = ref<'LOST' | 'FOUND'>('LOST');
const reportCategoryFilter = ref('ALL');
const hasAttemptedReportSubmit = ref(false);

const reportForm = reactive({
  title: '',
  category: 'ELECTRONICS',
  building: 'Central Library',
  faculty: 'General Studies',
  location: '',
  description: '',
  reporterName: '',
  reporterPhone: '',
  reporterEmail: '',
  imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
});

const reportTouched = reactive({
  title: false,
  location: false,
  description: false,
  reporterName: false,
  reporterPhone: false,
  reporterEmail: false
});

const autoFillContact = () => {
  reportForm.reporterName = 'Alex Rivera';
  reportForm.reporterPhone = '+1 (555) 234-5678';
  reportForm.reporterEmail = 'alex.r@university.edu';
  reportTouched.reporterName = true;
  reportTouched.reporterPhone = true;
  reportTouched.reporterEmail = true;
};

// Email Regex Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone Regex Validation (digits, spaces, hyphens, plus)
const phoneRegex = /^[\+\d\s\(\)\-]{7,20}$/;

const reportErrors = computed(() => {
  const errors: Record<string, string> = {};

  if (!reportForm.title.trim()) {
    errors.title = 'Item title is required.';
  } else if (reportForm.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }

  if (!reportForm.location.trim()) {
    errors.location = 'Exact location is required.';
  } else if (reportForm.location.trim().length < 3) {
    errors.location = 'Location description is too short.';
  }

  if (!reportForm.description.trim()) {
    errors.description = 'Detailed description is required.';
  } else if (reportForm.description.trim().length < 10) {
    errors.description = 'Please provide at least 10 characters of description.';
  }

  if (!reportForm.reporterName.trim()) {
    errors.reporterName = 'Reporter name is required.';
  } else if (reportForm.reporterName.trim().length < 2) {
    errors.reporterName = 'Name must be at least 2 characters.';
  }

  if (!reportForm.reporterPhone.trim()) {
    errors.reporterPhone = 'Phone number is required.';
  } else if (!phoneRegex.test(reportForm.reporterPhone.trim())) {
    errors.reporterPhone = 'Please enter a valid phone number (e.g., +1 555-0192).';
  }

  if (!reportForm.reporterEmail.trim()) {
    errors.reporterEmail = 'Email address is required.';
  } else if (!emailRegex.test(reportForm.reporterEmail.trim())) {
    errors.reporterEmail = 'Please enter a valid email address.';
  }

  return errors;
});

const isReportFormValid = computed(() => {
  return Object.keys(reportErrors.value).length === 0;
});

// Preset Images with categories for filtering in Report Modal
const PRESET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80', cat: 'ELECTRONICS', name: 'Laptop' },
  { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', cat: 'BAGS', name: 'Backpack' },
  { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80', cat: 'PERSONAL ITEMS', name: 'Water Bottle' },
  { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', cat: 'ELECTRONICS', name: 'Headphones' },
  { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', cat: 'BOOKS', name: 'Textbook' },
  { url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80', cat: 'KEYS', name: 'Keys' },
  { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', cat: 'PHONE', name: 'Smartphone' },
  { url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80', cat: 'STUDENT ID', name: 'ID Card' },
];

const filteredPresetImages = computed(() => {
  if (reportCategoryFilter.value === 'ALL') return PRESET_IMAGES;
  return PRESET_IMAGES.filter((img) => img.cat === reportCategoryFilter.value);
});

// ==========================================
// FORM VALIDATION & STATE: CLAIM MODAL
// ==========================================
const claimForm = reactive({
  claimerName: '',
  claimerPhone: '',
  claimerEmail: '',
  message: ''
});

const claimTouched = reactive({
  claimerName: false,
  claimerPhone: false,
  claimerEmail: false,
  message: false
});

const claimSent = ref(false);
const isSubmittingClaim = ref(false);

const claimErrors = computed(() => {
  const errors: Record<string, string> = {};

  if (!claimForm.claimerName.trim()) {
    errors.claimerName = 'Your name is required.';
  }

  if (!claimForm.claimerPhone.trim()) {
    errors.claimerPhone = 'Phone number is required.';
  } else if (!phoneRegex.test(claimForm.claimerPhone.trim())) {
    errors.claimerPhone = 'Valid phone required.';
  }

  if (!claimForm.claimerEmail.trim()) {
    errors.claimerEmail = 'Email address is required.';
  } else if (!emailRegex.test(claimForm.claimerEmail.trim())) {
    errors.claimerEmail = 'Valid email required.';
  }

  if (!claimForm.message.trim()) {
    errors.message = 'Proof of ownership or description is required.';
  } else if (claimForm.message.trim().length < 8) {
    errors.message = 'Please provide at least 8 characters explaining your claim.';
  }

  return errors;
});

const isClaimFormValid = computed(() => {
  return Object.keys(claimErrors.value).length === 0;
});

// ==========================================
// PAGINATION STATE: MY ITEMS
// ==========================================
const myItemsFilterType = ref<'ALL' | 'LOST' | 'FOUND'>('ALL');
const myItemsSearch = ref('');
const myItemsCurrentPage = ref(1);
const myItemsPerPage = 6;

const myItemsList = computed(() => {
  return items.value.filter((item) => {
    const isUserItem = item.id.startsWith('lost-') || item.id.startsWith('reported-') || item.reporterName === 'Alex Rivera';
    const matchesType = myItemsFilterType.value === 'ALL' || item.type === myItemsFilterType.value;
    const q = myItemsSearch.value.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.building.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    return isUserItem && matchesType && matchesQuery;
  });
});

const myItemsTotalPages = computed(() => {
  return Math.ceil(myItemsList.value.length / myItemsPerPage) || 1;
});

const myItemsPaginated = computed(() => {
  const start = (myItemsCurrentPage.value - 1) * myItemsPerPage;
  return myItemsList.value.slice(start, start + myItemsPerPage);
});

// ==========================================
// HOME PAGE FILTERED & SORTED ITEMS
// ==========================================
const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const topQ = searchQuery.value.toLowerCase().trim();
    const mainQ = mainKeywordQuery.value.toLowerCase().trim();

    const matchesTopQuery =
      !topQ ||
      item.title.toLowerCase().includes(topQ) ||
      item.building.toLowerCase().includes(topQ) ||
      item.category.toLowerCase().includes(topQ) ||
      (item.description && item.description.toLowerCase().includes(topQ));

    const matchesMainQuery =
      !mainQ ||
      item.title.toLowerCase().includes(mainQ) ||
      item.building.toLowerCase().includes(mainQ) ||
      item.faculty.toLowerCase().includes(mainQ) ||
      item.category.toLowerCase().includes(mainQ) ||
      (item.description && item.description.toLowerCase().includes(mainQ));

    const matchesCategory =
      selectedCategory.value === 'All Categories' ||
      item.category.toUpperCase() === selectedCategory.value.toUpperCase();

    const matchesBuilding =
      selectedBuilding.value === 'Select Building' ||
      item.building === selectedBuilding.value;

    const matchesFaculty =
      selectedFaculty.value === 'Select Faculty' ||
      item.faculty === selectedFaculty.value;

    const matchesStatus =
      selectedStatusFilter.value === 'ALL' ||
      (selectedStatusFilter.value === 'ACTIVE' && (item.status === 'ACTIVE' || item.status === 'IN_CLAIM')) ||
      (selectedStatusFilter.value === 'RESOLVED' && (item.status === 'FOUND_BY_OWNER' || item.status === 'RETURNED_TO_OWNER' || item.status === 'RECONNECTED'));

    return matchesTopQuery && matchesMainQuery && matchesCategory && matchesBuilding && matchesFaculty && matchesStatus;
  }).sort((a, b) => {
    if (sortBy.value === 'Oldest First') {
      return a.id.localeCompare(b.id);
    } else if (sortBy.value === 'Title A-Z') {
      return a.title.localeCompare(b.title);
    }
    return b.id.localeCompare(a.id);
  });
});

const displayedItems = computed(() => {
  return filteredItems.value.slice(0, displayCount.value);
});

// ==========================================
// METHODS
// ==========================================
const resetFilters = () => {
  searchQuery.value = '';
  mainKeywordQuery.value = '';
  selectedCategory.value = 'All Categories';
  selectedBuilding.value = 'Select Building';
  selectedFaculty.value = 'Select Faculty';
  selectedTimeframe.value = 'Any Time';
  selectedStatusFilter.value = 'ALL';
  sortBy.value = 'Newest First';
};

const openItemModal = (item: CampusItem) => {
  selectedItemDetail.value = item;
  claimSent.value = false;
  claimForm.claimerName = '';
  claimForm.claimerPhone = '';
  claimForm.claimerEmail = '';
  claimForm.message = '';
  claimTouched.claimerName = false;
  claimTouched.claimerPhone = false;
  claimTouched.claimerEmail = false;
  claimTouched.message = false;
};

const handleClaim = () => {
  claimTouched.claimerName = true;
  claimTouched.claimerPhone = true;
  claimTouched.claimerEmail = true;
  claimTouched.message = true;

  if (!isClaimFormValid.value) return;

  isSubmittingClaim.value = true;
  setTimeout(() => {
    isSubmittingClaim.value = false;
    claimSent.value = true;
    if (selectedItemDetail.value) {
      selectedItemDetail.value.status = 'IN_CLAIM';
    }
  }, 600);
};

const handleAddReport = () => {
  hasAttemptedReportSubmit.value = true;
  reportTouched.title = true;
  reportTouched.location = true;
  reportTouched.description = true;
  reportTouched.reporterName = true;
  reportTouched.reporterPhone = true;
  reportTouched.reporterEmail = true;

  if (!isReportFormValid.value) return;

  const newItem: CampusItem = {
    id: `reported-${Date.now()}`,
    title: reportForm.title.trim(),
    type: reportType.value,
    category: reportForm.category.toUpperCase(),
    building: reportForm.building,
    faculty: reportForm.faculty,
    location: reportForm.location.trim(),
    date: 'Just Now',
    imageUrl: reportForm.imageUrl,
    description: reportForm.description.trim(),
    reporterName: reportForm.reporterName.trim(),
    reporterPhone: reportForm.reporterPhone.trim(),
    reporterEmail: reportForm.reporterEmail.trim(),
    reporterContact: reportForm.reporterEmail.trim(),
    status: 'ACTIVE',
    securityPost: `${reportForm.building} Security Post`
  };

  items.value.unshift(newItem);
  isReportModalOpen.value = false;

  // Reset Report Form
  hasAttemptedReportSubmit.value = false;
  reportForm.title = '';
  reportForm.location = '';
  reportForm.description = '';
  reportForm.reporterName = '';
  reportForm.reporterPhone = '';
  reportForm.reporterEmail = '';
  reportTouched.title = false;
  reportTouched.location = false;
  reportTouched.description = false;
  reportTouched.reporterName = false;
  reportTouched.reporterPhone = false;
  reportTouched.reporterEmail = false;
};

const deleteMyItem = (itemId: string) => {
  items.value = items.value.filter((i) => i.id !== itemId);
};

const loadMore = () => {
  displayCount.value += 6;
};
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white relative">
    <!-- Floating Toast Notification for Status Updates -->
    <div
      v-if="statusChangeMessage"
      class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 max-w-md animate-bounce"
    >
      <span class="text-base">✨</span>
      <p class="text-xs font-bold leading-snug">{{ statusChangeMessage }}</p>
      <button @click="statusChangeMessage = null" class="text-slate-400 hover:text-white font-bold ml-auto text-xs shrink-0">✕</button>
    </div>

    <!-- Top Navigation Header (No hardcoded login name) -->
    <header class="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2.5 transition-all">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <!-- Left Logo & Mobile Drawer Toggle -->
        <div class="flex items-center gap-3">
          <button
            @click="isOpenMobileSidebar = true"
            class="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Open Menu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <div class="flex items-center gap-2.5 cursor-pointer" @click="activeTab = 'dashboard'; resetFilters()">
            <div class="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <div>
              <span class="text-base font-bold text-slate-900 tracking-tight block leading-none">
                Campus Finders
              </span>
              <span class="text-[10px] text-slate-400 font-medium hidden sm:inline-block">
                Lost & Found Directory
              </span>
            </div>
          </div>
        </div>

        <!-- Center Search Bar with Validation Feedback -->
        <div class="flex-1 max-w-lg mx-2 sm:mx-6">
          <div class="relative">
            <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search lost items by name, category, or location..."
              class="w-full pl-10 pr-9 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs text-slate-900 placeholder-slate-400 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Right Header Actions (Clean, no customer login) -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Notification Bell -->
          <div class="relative">
            <button
              @click="showNotifications = !showNotifications"
              class="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 focus:outline-none transition-colors"
              title="Notifications"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
            </button>

            <!-- Notifications Dropdown -->
            <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
              <div class="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-900">System Alerts</span>
                <span class="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">2 New</span>
              </div>
              <div class="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div class="p-3 bg-blue-50/30 hover:bg-slate-50 transition-colors">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-semibold text-slate-900">Item Match Found</span>
                    <span class="text-[10px] text-slate-400">10m ago</span>
                  </div>
                  <p class="text-xs text-slate-600 mt-0.5">MacBook Pro matched at Central Library Security Desk.</p>
                </div>
                <div class="p-3 hover:bg-slate-50 transition-colors">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-semibold text-slate-900">Security Guard Sweep</span>
                    <span class="text-[10px] text-slate-400">1h ago</span>
                  </div>
                  <p class="text-xs text-slate-600 mt-0.5">Engineering Block A sweep logged 4 new items.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Report Item Button -->
          <button
            @click="isReportModalOpen = true"
            class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span class="hidden sm:inline">Report Item</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="flex-1 max-w-7xl w-full mx-auto flex">
      <!-- Sidebar Navigation (Home Page instead of Dashboard) -->
      <aside class="hidden lg:block w-60 shrink-0 border-r border-slate-200/80 bg-[#f3f4f6]/70 min-h-[calc(100vh-53px)]">
        <div class="p-4 flex flex-col justify-between h-full">
          <div class="space-y-1">
            <!-- Home Page Menu Item -->
            <button
              @click="activeTab = 'dashboard'"
              :class="[
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                activeTab === 'dashboard'
                  ? 'bg-blue-100/70 text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              ]"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span>Home Page</span>
            </button>

            <!-- Report Item Link -->
            <button
              @click="isReportModalOpen = true"
              class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-all"
            >
              <svg class="w-4 h-4 shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Report Item</span>
            </button>

            <!-- Reported Items Link -->
            <button
              @click="activeTab = 'my-items'; myItemsCurrentPage = 1"
              :class="[
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                activeTab === 'my-items'
                  ? 'bg-blue-100/70 text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              ]"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <span>Reported Items</span>
            </button>
          </div>

          <!-- Bottom Campus Info Badge -->
          <div class="pt-4 border-t border-slate-200/80 mt-auto">
            <div class="p-3 rounded-xl bg-slate-200/50 border border-slate-200/60">
              <p class="text-[11px] font-bold text-slate-800">Campus Security Desk</p>
              <p class="text-[10px] text-slate-500 mt-0.5">24/7 Hotline: (555) 019-2831</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Mobile Drawer Sidebar -->
      <div v-if="isOpenMobileSidebar" class="fixed inset-0 z-50 lg:hidden flex">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-xs" @click="isOpenMobileSidebar = false" />
        <div class="relative z-10 w-64 max-w-xs bg-white h-full p-4 flex flex-col justify-between shadow-xl">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-200">
              <span class="font-bold text-slate-900 text-sm">Campus Navigation</span>
              <button @click="isOpenMobileSidebar = false" class="p-1 rounded-md text-slate-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <nav class="space-y-1">
              <button @click="activeTab = 'dashboard'; isOpenMobileSidebar = false" class="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">Home Page</button>
              <button @click="isReportModalOpen = true; isOpenMobileSidebar = false" class="w-full text-left px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg">+ Report Item</button>
              <button @click="activeTab = 'my-items'; isOpenMobileSidebar = false" class="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">Reported Items</button>
            </nav>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 flex flex-col justify-between">
        <!-- TAB 1: HOME PAGE (LOST & FOUND DIRECTORY) -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6">
          <!-- Main Page Title Header -->
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <!-- Tag -->
              <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-extrabold text-blue-600 tracking-wider uppercase mb-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>CAMPUS FINDERS</span>
              </div>

              <!-- Page Title: Home Page -->
              <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Home Page
              </h1>

              <!-- Page Description -->
              <p class="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Welcome to the institutional lost items database. Filter by category, campus building, or faculty to find missing belongings or submit a new report.
              </p>
            </div>

            <!-- Action Button -->
            <button
              @click="isReportModalOpen = true"
              class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span>Report Lost / Found Item</span>
            </button>
          </div>

          <!-- Keyword Search Bar with Validation Message -->
          <div class="space-y-1">
            <div class="relative">
              <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                v-model="mainKeywordQuery"
                placeholder="Search by keyword, item name, brand, color, building or reporter contact..."
                class="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-all"
              />
              <button
                v-if="mainKeywordQuery"
                @click="mainKeywordQuery = ''"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- SMART FILTERS Card -->
          <div class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              <span class="text-[11px] font-extrabold tracking-wider text-slate-800 uppercase">
                SMART FILTERS
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <!-- CATEGORY -->
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  CATEGORY
                </label>
                <select
                  v-model="selectedCategory"
                  class="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                >
                  <option v-for="cat in INITIAL_CATEGORIES" :key="cat.id" :value="cat.name">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <!-- CAMPUS BUILDING -->
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  CAMPUS BUILDING
                </label>
                <select
                  v-model="selectedBuilding"
                  class="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                >
                  <option v-for="bldg in INITIAL_BUILDINGS" :key="bldg" :value="bldg">
                    {{ bldg }}
                  </option>
                </select>
              </div>

              <!-- FACULTY -->
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  FACULTY
                </label>
                <select
                  v-model="selectedFaculty"
                  class="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                >
                  <option v-for="fac in INITIAL_FACULTIES" :key="fac" :value="fac">
                    {{ fac }}
                  </option>
                </select>
              </div>

              <!-- RESOLUTION STATUS -->
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  RESOLUTION STATUS
                </label>
                <select
                  v-model="selectedStatusFilter"
                  class="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active (Missing / Unclaimed)</option>
                  <option value="RESOLVED">Resolved (Found / Returned)</option>
                </select>
              </div>

              <!-- Reset Button -->
              <div class="pt-2 sm:pt-0">
                <button
                  @click="resetFilters"
                  class="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors self-center"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <!-- Items Bar Header -->
          <div class="flex items-center justify-between gap-2 pt-2">
            <div class="flex items-center gap-3">
              <h2 class="text-base font-bold text-slate-900 tracking-tight">
                Reported Items Catalog
              </h2>
              <span class="bg-blue-50 text-blue-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
                {{ filteredItems.length }} Items
              </span>
            </div>

            <!-- Sort By Dropdown -->
            <div class="flex items-center gap-1.5 text-xs text-slate-600">
              <span class="hidden sm:inline font-medium text-slate-500">Sort by:</span>
              <select
                v-model="sortBy"
                class="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="Title A-Z">Title A-Z</option>
              </select>
            </div>
          </div>

          <!-- Empty Results State -->
          <div v-if="filteredItems.length === 0" class="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 my-6">
            <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <p class="text-sm font-bold text-slate-800">No matching lost or found items</p>
            <p class="text-xs text-slate-500 mt-1">Try clearing your filters or search terms.</p>
            <button @click="resetFilters" class="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-xs">
              Clear All Filters
            </button>
          </div>

          <!-- Items Grid (3 Columns) -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div
              v-for="item in displayedItems"
              :key="item.id"
              class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition-all group"
            >
              <!-- Card Top Image with Badges -->
              <div class="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  :src="item.imageUrl"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  :class="[
                    'absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs',
                    item.type === 'LOST' ? 'bg-slate-800/90' : 'bg-blue-600/90'
                  ]"
                >
                  {{ item.type }}
                </span>

                <!-- Status Badge -->
                <span
                  :class="[
                    'absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] border shadow-xs backdrop-blur-xs font-bold',
                    getStatusBadgeClass(item.status, item.type)
                  ]"
                >
                  {{ getStatusLabel(item) }}
                </span>
              </div>

              <!-- Card Body Content -->
              <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <!-- Category -->
                  <span class="text-[10px] font-extrabold tracking-wider text-blue-600 uppercase block mb-0.5">
                    {{ item.category }}
                  </span>

                  <!-- Title -->
                  <h3 class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {{ item.title }}
                  </h3>

                  <!-- Metadata List -->
                  <div class="mt-3 space-y-1.5 text-xs text-slate-600">
                    <!-- Building -->
                    <div class="flex items-center gap-2">
                      <svg class="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                      <span class="truncate">{{ item.building }}</span>
                    </div>

                    <!-- Faculty -->
                    <div class="flex items-center gap-2">
                      <svg class="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                      </svg>
                      <span class="truncate">{{ item.faculty }}</span>
                    </div>

                    <!-- Reporter Person Name -->
                    <div v-if="item.reporterName" class="flex items-center gap-2 text-slate-700 font-medium">
                      <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      <span class="truncate">Reported by: {{ item.reporterName }}</span>
                    </div>
                  </div>

                  <!-- Description -->
                  <p class="text-xs text-slate-600 line-clamp-2 mt-2.5 leading-relaxed">
                    {{ item.description }}
                  </p>
                </div>

                <!-- Card Footer Action -->
                <div class="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div class="flex items-center gap-2">
                    <button
                      @click="openItemModal(item)"
                      class="flex-1 py-2 px-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-blue-600 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors truncate"
                    >
                      <span>View Details</span>
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>

                    <!-- Quick Status Toggle Button -->
                    <button
                      v-if="item.type === 'LOST' && item.status !== 'FOUND_BY_OWNER'"
                      @click="updateItemStatus(item, 'FOUND_BY_OWNER')"
                      title="Mark as Found It (Recovered by Owner)"
                      class="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 shrink-0"
                    >
                      <span>🎉 Found It!</span>
                    </button>
                    <button
                      v-else-if="item.type === 'FOUND' && item.status !== 'RETURNED_TO_OWNER'"
                      @click="updateItemStatus(item, 'RETURNED_TO_OWNER')"
                      title="Mark as Returned to Owner"
                      class="py-2 px-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 shrink-0"
                    >
                      <span>🎁 Handed Back</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Pagination Section -->
          <div class="pt-8 pb-4 text-center border-t border-slate-200/60 mt-8">
            <p class="text-xs text-slate-500 font-medium mb-3">
              Showing {{ displayedItems.length }} of {{ filteredItems.length }} items
            </p>

            <button
              v-if="displayedItems.length < filteredItems.length"
              @click="loadMore"
              class="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors inline-flex items-center gap-2"
            >
              <span>Load More Reports</span>
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- TAB 2: MY ITEMS (WITH PAGINATION OF 6 & DIRECT LINK) -->
        <div v-if="activeTab === 'my-items'" class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h1 class="text-2xl font-bold text-slate-900">My Reported Items</h1>
              <p class="text-xs text-slate-500 mt-0.5">Manage items you have logged or claimed. Page size: 6 items.</p>
            </div>
            
            <div class="flex items-center gap-2 flex-wrap">
              <!-- Link to jump to Home Page -->
              <button
                @click="activeTab = 'dashboard'"
                class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <span>Explore All Items on Home Page</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </button>

              <button
                @click="isReportModalOpen = true"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-2xs flex items-center gap-1.5"
              >
                <span>+ Report New Item</span>
              </button>
            </div>
          </div>

          <!-- My Items Filter & Search Bar -->
          <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <!-- Filter Tabs -->
            <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              <button
                @click="myItemsFilterType = 'ALL'; myItemsCurrentPage = 1"
                :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-all', myItemsFilterType === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600']"
              >
                All ({{ items.length }})
              </button>
              <button
                @click="myItemsFilterType = 'LOST'; myItemsCurrentPage = 1"
                :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-all', myItemsFilterType === 'LOST' ? 'bg-slate-800 text-white' : 'text-slate-600']"
              >
                Lost Items
              </button>
              <button
                @click="myItemsFilterType = 'FOUND'; myItemsCurrentPage = 1"
                :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-all', myItemsFilterType === 'FOUND' ? 'bg-blue-600 text-white' : 'text-slate-600']"
              >
                Found Items
              </button>
            </div>

            <!-- Quick Search -->
            <div class="w-full sm:w-64 relative">
              <input
                type="text"
                v-model="myItemsSearch"
                @input="myItemsCurrentPage = 1"
                placeholder="Filter my items..."
                class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <svg class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="myItemsList.length === 0" class="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <p class="text-sm font-bold text-slate-800">No items found in your reports</p>
            <p class="text-xs text-slate-500 mt-1">Submit a report or clear filters to see logged items.</p>
          </div>

          <!-- Items Grid (6 per page) -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="item in myItemsPaginated"
              :key="item.id"
              class="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs relative flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div class="flex gap-3">
                  <img :src="item.imageUrl" :alt="item.title" class="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100" />
                  <div class="flex-1 min-w-0">
                    <span class="text-[10px] font-extrabold text-blue-600 uppercase block">{{ item.type }} • {{ item.category }}</span>
                    <h3 class="text-xs font-bold text-slate-900 truncate mt-0.5">{{ item.title }}</h3>
                    <p class="text-[11px] text-slate-500 truncate">{{ item.building }}</p>
                    <span :class="['mt-1 inline-block px-2 py-0.5 rounded-md text-[10px] border', getStatusBadgeClass(item.status, item.type)]">
                      {{ getStatusLabel(item) }}
                    </span>
                  </div>
                </div>

                <!-- Reporter Contact Badge -->
                <div class="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <p class="font-semibold text-slate-800">Contact Person:</p>
                  <p v-if="item.reporterName">👤 {{ item.reporterName }}</p>
                  <p v-if="item.reporterPhone">📞 {{ item.reporterPhone }}</p>
                  <p v-if="item.reporterEmail">✉️ {{ item.reporterEmail }}</p>
                </div>

                <!-- QUICK RESOLUTION ACTIONS FOR MY ITEMS -->
                <div class="mt-3 pt-2 border-t border-slate-100">
                  <template v-if="item.type === 'LOST'">
                    <button
                      v-if="item.status !== 'FOUND_BY_OWNER'"
                      @click="updateItemStatus(item, 'FOUND_BY_OWNER')"
                      class="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1"
                    >
                      <span>🎉 I Found It! (Mark Recovered)</span>
                    </button>
                    <button
                      v-else
                      @click="updateItemStatus(item, 'ACTIVE')"
                      class="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all border border-slate-200"
                    >
                      <span>🔄 Mark Still Missing</span>
                    </button>
                  </template>

                  <template v-else>
                    <button
                      v-if="item.status !== 'RETURNED_TO_OWNER'"
                      @click="updateItemStatus(item, 'RETURNED_TO_OWNER')"
                      class="w-full py-1.5 px-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1"
                    >
                      <span>🎁 Mark "Returned to Owner"</span>
                    </button>
                    <button
                      v-else
                      @click="updateItemStatus(item, 'ACTIVE')"
                      class="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all border border-slate-200"
                    >
                      <span>🔄 Reset to Active at Security</span>
                    </button>
                  </template>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button @click="openItemModal(item)" class="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  <span>View Details</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
                <button @click="deleteMyItem(item.id)" class="text-xs text-rose-500 hover:text-rose-700 p-1 rounded font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination Bar (6 items per page) -->
          <div v-if="myItemsTotalPages > 1" class="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <span class="text-xs font-medium text-slate-500">
              Page {{ myItemsCurrentPage }} of {{ myItemsTotalPages }} (Showing {{ myItemsPaginated.length }} of {{ myItemsList.length }} items)
            </span>

            <div class="flex items-center gap-1.5">
              <button
                @click="myItemsCurrentPage = Math.max(1, myItemsCurrentPage - 1)"
                :disabled="myItemsCurrentPage === 1"
                class="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200"
              >
                Previous
              </button>

              <button
                v-for="p in myItemsTotalPages"
                :key="p"
                @click="myItemsCurrentPage = p"
                :class="[
                  'w-8 h-8 rounded-lg text-xs font-bold transition-colors',
                  myItemsCurrentPage === p ? 'bg-blue-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                ]"
              >
                {{ p }}
              </button>

              <button
                @click="myItemsCurrentPage = Math.min(myItemsTotalPages, myItemsCurrentPage + 1)"
                :disabled="myItemsCurrentPage === myItemsTotalPages"
                class="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <!-- TAB 3: SETTINGS -->
        <div v-if="activeTab === 'settings'" class="max-w-2xl bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div>
            <h1 class="text-xl font-bold text-slate-900">Campus System Settings</h1>
            <p class="text-xs text-slate-500 mt-0.5">Configure notification alerts and security station contact preferences.</p>
          </div>

          <div class="space-y-4 pt-2">
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-slate-900">Instant Email Notifications</p>
                <p class="text-[11px] text-slate-500 mt-0.5">Receive immediate notifications when an item matching your lost report is filed.</p>
              </div>
              <input type="checkbox" checked class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
            </div>

            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-slate-900">SMS Phone Alerts</p>
                <p class="text-[11px] text-slate-500 mt-0.5">Get text alerts directly when someone submits a claim on your report.</p>
              </div>
              <input type="checkbox" checked class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <!-- Global Footer -->
        <footer class="mt-16 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <span class="font-semibold text-slate-700">Campus Finders — Institutional Lost & Found System</span>
          </div>

          <div class="flex items-center gap-3 text-[11px] font-medium text-slate-500 flex-wrap">
            <a href="#help" class="hover:text-blue-600 transition-colors uppercase">HELP CENTER</a>
            <span>•</span>
            <a href="#privacy" class="hover:text-blue-600 transition-colors uppercase">PRIVACY POLICY</a>
            <span>•</span>
            <a href="#accessibility" class="hover:text-blue-600 transition-colors uppercase">ACCESSIBILITY</a>
            <span>|</span>
            <span>© 2026 University Security Division</span>
          </div>
        </footer>
      </main>
    </div>

    <!-- ITEM DETAIL MODAL (WITH DEDICATED PERSON INFORMATION / CONTACT SECTION) -->
    <div v-if="selectedItemDetail" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative overflow-hidden">
        <div class="relative h-60 w-full bg-slate-900">
          <img :src="selectedItemDetail.imageUrl" :alt="selectedItemDetail.title" class="w-full h-full object-cover opacity-90" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <button @click="selectedItemDetail = null" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
            ✕
          </button>

          <div class="absolute top-4 left-4 flex gap-2">
            <span :class="['px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase text-white', selectedItemDetail.type === 'LOST' ? 'bg-slate-800' : 'bg-blue-600']">
              {{ selectedItemDetail.type }} ITEM
            </span>
            <span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-white/20 text-white backdrop-blur-md">
              {{ selectedItemDetail.category }}
            </span>
          </div>

          <div class="absolute bottom-4 left-6 right-6 text-white">
            <h2 class="text-xl font-bold tracking-tight">{{ selectedItemDetail.title }}</h2>
          </div>
        </div>

        <div class="p-6 space-y-5">
          <!-- Item Info Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase">Building</p>
              <p class="font-semibold text-slate-800 mt-0.5">{{ selectedItemDetail.building }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase">Faculty</p>
              <p class="font-semibold text-slate-800 mt-0.5">{{ selectedItemDetail.faculty }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase">Report Date</p>
              <p class="font-semibold text-slate-800 mt-0.5">{{ selectedItemDetail.date }}</p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</h3>
            <p class="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
              {{ selectedItemDetail.description || 'No additional details provided.' }}
            </p>
          </div>

          <!-- DEDICATED PERSON / REPORTER INFORMATION SECTION -->
          <div class="bg-blue-50/70 rounded-2xl p-4 border border-blue-200/80 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Reporter Contact Information
              </span>
              <span class="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">Verified Person</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <!-- Name -->
              <div class="bg-white p-2.5 rounded-xl border border-blue-100">
                <span class="text-[10px] text-slate-400 font-bold block uppercase">Name</span>
                <span class="font-semibold text-slate-900 block mt-0.5">{{ selectedItemDetail.reporterName || 'Alex Rivera' }}</span>
              </div>

              <!-- Phone -->
              <div class="bg-white p-2.5 rounded-xl border border-blue-100">
                <span class="text-[10px] text-slate-400 font-bold block uppercase">Phone</span>
                <a :href="'tel:' + (selectedItemDetail.reporterPhone || '+1 (555) 234-5678')" class="font-semibold text-blue-600 hover:underline block mt-0.5">
                  📞 {{ selectedItemDetail.reporterPhone || '+1 (555) 234-5678' }}
                </a>
              </div>

              <!-- Email -->
              <div class="bg-white p-2.5 rounded-xl border border-blue-100">
                <span class="text-[10px] text-slate-400 font-bold block uppercase">Email</span>
                <a :href="'mailto:' + (selectedItemDetail.reporterEmail || 'alex.r@university.edu')" class="font-semibold text-blue-600 hover:underline block mt-0.5 truncate">
                  ✉️ {{ selectedItemDetail.reporterEmail || 'alex.r@university.edu' }}
                </a>
              </div>
            </div>
          </div>

          <!-- ITEM RESOLUTION STATUS MANAGEMENT -->
          <div class="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl p-4 border border-slate-200/90 space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Item Resolution Status
                </h3>
                <p class="text-[11px] text-slate-500 mt-0.5">
                  <template v-if="selectedItemDetail.type === 'LOST'">
                    If you lost this item and have now found it, mark its status below.
                  </template>
                  <template v-else>
                    If you found this item and handed it back to its owner, mark its status below.
                  </template>
                </p>
              </div>

              <!-- Current Badge -->
              <span :class="['px-2.5 py-1 rounded-lg text-xs border shadow-2xs', getStatusBadgeClass(selectedItemDetail.status, selectedItemDetail.type)]">
                {{ getStatusLabel(selectedItemDetail) }}
              </span>
            </div>

            <!-- Status Change Buttons -->
            <div class="flex items-center gap-2 flex-wrap pt-1">
              <template v-if="selectedItemDetail.type === 'LOST'">
                <button
                  @click="updateItemStatus(selectedItemDetail, 'FOUND_BY_OWNER')"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer',
                    selectedItemDetail.status === 'FOUND_BY_OWNER'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  ]"
                >
                  <span>🎉 Found It! (Owner Recovered)</span>
                </button>

                <button
                  @click="updateItemStatus(selectedItemDetail, 'RECONNECTED')"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer',
                    selectedItemDetail.status === 'RECONNECTED'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
                  ]"
                >
                  <span>🤝 Reconnected</span>
                </button>

                <button
                  v-if="selectedItemDetail.status !== 'ACTIVE'"
                  @click="updateItemStatus(selectedItemDetail, 'ACTIVE')"
                  class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  <span>🔄 Reset to Missing</span>
                </button>
              </template>

              <template v-else>
                <button
                  @click="updateItemStatus(selectedItemDetail, 'RETURNED_TO_OWNER')"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer',
                    selectedItemDetail.status === 'RETURNED_TO_OWNER'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200'
                  ]"
                >
                  <span>🎁 Returned to Owner</span>
                </button>

                <button
                  @click="updateItemStatus(selectedItemDetail, 'RECONNECTED')"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer',
                    selectedItemDetail.status === 'RECONNECTED'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
                  ]"
                >
                  <span>🤝 Reconnected</span>
                </button>

                <button
                  v-if="selectedItemDetail.status !== 'ACTIVE'"
                  @click="updateItemStatus(selectedItemDetail, 'ACTIVE')"
                  class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  <span>🔄 Reset to Active at Security</span>
                </button>
              </template>
            </div>
          </div>

          <!-- Security Post Location -->
          <div class="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p class="font-bold text-xs text-slate-900">Campus Security Station</p>
            <p class="text-xs text-slate-600 mt-0.5">Held at: {{ selectedItemDetail.securityPost || 'Main Security Booth' }}</p>
          </div>

          <!-- CLAIM FORM WITH INPUT VALIDATION -->
          <div class="border-t border-slate-100 pt-4">
            <div v-if="claimSent" class="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200">
              <p class="text-xs font-bold">Claim Inquiry Sent!</p>
              <p class="text-xs mt-0.5">The reporter ({{ selectedItemDetail.reporterName || 'Alex Rivera' }}) and campus security have been notified.</p>
            </div>
            <form v-else @submit.prevent="handleClaim" class="space-y-3">
              <h3 class="text-xs font-bold text-slate-900 uppercase">Submit Claim Inquiry</h3>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <!-- Claimer Name -->
                <div>
                  <input
                    type="text"
                    v-model="claimForm.claimerName"
                    @blur="claimTouched.claimerName = true"
                    placeholder="Your Name *"
                    :class="[
                      'w-full p-2 bg-slate-50 border rounded-lg text-xs focus:outline-none',
                      claimTouched.claimerName && claimErrors.claimerName ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                    ]"
                  />
                  <p v-if="claimTouched.claimerName && claimErrors.claimerName" class="text-[10px] text-rose-500 mt-0.5">
                    {{ claimErrors.claimerName }}
                  </p>
                </div>

                <!-- Claimer Phone -->
                <div>
                  <input
                    type="tel"
                    v-model="claimForm.claimerPhone"
                    @blur="claimTouched.claimerPhone = true"
                    placeholder="Your Phone *"
                    :class="[
                      'w-full p-2 bg-slate-50 border rounded-lg text-xs focus:outline-none',
                      claimTouched.claimerPhone && claimErrors.claimerPhone ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                    ]"
                  />
                  <p v-if="claimTouched.claimerPhone && claimErrors.claimerPhone" class="text-[10px] text-rose-500 mt-0.5">
                    {{ claimErrors.claimerPhone }}
                  </p>
                </div>

                <!-- Claimer Email -->
                <div>
                  <input
                    type="email"
                    v-model="claimForm.claimerEmail"
                    @blur="claimTouched.claimerEmail = true"
                    placeholder="Your Email *"
                    :class="[
                      'w-full p-2 bg-slate-50 border rounded-lg text-xs focus:outline-none',
                      claimTouched.claimerEmail && claimErrors.claimerEmail ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                    ]"
                  />
                  <p v-if="claimTouched.claimerEmail && claimErrors.claimerEmail" class="text-[10px] text-rose-500 mt-0.5">
                    {{ claimErrors.claimerEmail }}
                  </p>
                </div>
              </div>

              <!-- Claim Message -->
              <div>
                <textarea
                  rows="3"
                  v-model="claimForm.message"
                  @blur="claimTouched.message = true"
                  placeholder="Describe distinguishing marks, serial numbers, or proof of ownership..."
                  :class="[
                    'w-full p-2.5 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:outline-none',
                    claimTouched.message && claimErrors.message ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                  ]"
                ></textarea>
                <p v-if="claimTouched.message && claimErrors.message" class="text-[10px] text-rose-500 mt-0.5">
                  {{ claimErrors.message }}
                </p>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isSubmittingClaim"
                  class="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition-colors"
                >
                  {{ isSubmittingClaim ? 'Sending Claim...' : 'Submit Claim Request' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- REPORT ITEM MODAL (WITH CATEGORY FILTER & INPUT VALIDATIONS) -->
    <div v-if="isReportModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Report Lost or Found Item</h2>
            <p class="text-xs text-slate-500 mt-0.5">Log an item with full contact information and validation.</p>
          </div>
          <button @click="isReportModalOpen = false" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        <!-- Submit Error Summary Banner -->
        <div v-if="hasAttemptedReportSubmit && !isReportFormValid" class="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2 animate-fade-in">
          <svg class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <p class="font-bold">Cannot Post Report</p>
            <p class="text-[11px] text-rose-600">Please correct the {{ Object.keys(reportErrors).length }} highlighted field(s) below before submitting.</p>
          </div>
        </div>

        <form @submit.prevent="handleAddReport" class="mt-4 space-y-4">
          <!-- Report Type -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Report Type *</label>
            <div class="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                @click="reportType = 'LOST'"
                :class="['py-2 rounded-lg text-xs font-bold transition-all', reportType === 'LOST' ? 'bg-slate-800 text-white' : 'text-slate-600']"
              >
                LOST ITEM
              </button>
              <button
                type="button"
                @click="reportType = 'FOUND'"
                :class="['py-2 rounded-lg text-xs font-bold transition-all', reportType === 'FOUND' ? 'bg-blue-600 text-white' : 'text-slate-600']"
              >
                FOUND ITEM
              </button>
            </div>
          </div>

          <!-- Item Title with Validation -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold text-slate-700 uppercase">Item Title *</label>
              <span v-if="reportTouched.title && !reportErrors.title" class="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                ✓ Valid
              </span>
            </div>
            <input
              type="text"
              v-model="reportForm.title"
              @blur="reportTouched.title = true"
              placeholder="e.g., Silver MacBook Pro 14&quot;"
              :class="[
                'w-full p-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none transition-all',
                reportTouched.title && reportErrors.title ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20' :
                reportTouched.title && !reportErrors.title ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 focus:border-blue-500'
              ]"
            />
            <p v-if="reportTouched.title && reportErrors.title" class="text-[10px] text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <span>⚠️</span> {{ reportErrors.title }}
            </p>
          </div>

          <!-- Category & Building -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
              <select v-model="reportForm.category" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500">
                <option v-for="cat in INITIAL_CATEGORIES.filter(c => c.id !== 'ALL')" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Building *</label>
              <select v-model="reportForm.building" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500">
                <option v-for="bldg in INITIAL_BUILDINGS.filter(b => b !== 'Select Building')" :key="bldg" :value="bldg">
                  {{ bldg }}
                </option>
              </select>
            </div>
          </div>

          <!-- Faculty & Location -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Faculty *</label>
              <select v-model="reportForm.faculty" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500">
                <option v-for="fac in INITIAL_FACULTIES.filter(f => f !== 'Select Faculty')" :key="fac" :value="fac">
                  {{ fac }}
                </option>
              </select>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-bold text-slate-700 uppercase">Exact Location *</label>
                <span v-if="reportTouched.location && !reportErrors.location" class="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  ✓ Valid
                </span>
              </div>
              <input
                type="text"
                v-model="reportForm.location"
                @blur="reportTouched.location = true"
                placeholder="e.g., Level 3, Table 12"
                :class="[
                  'w-full p-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none transition-all',
                  reportTouched.location && reportErrors.location ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20' :
                  reportTouched.location && !reportErrors.location ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 focus:border-blue-500'
                ]"
              />
              <p v-if="reportTouched.location && reportErrors.location" class="text-[10px] text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
                <span>⚠️</span> {{ reportErrors.location }}
              </p>
            </div>
          </div>

          <!-- Description with Validation & Counter -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold text-slate-700 uppercase">Item Description *</label>
              <span class="text-[10px] text-slate-400">
                {{ reportForm.description.length }}/10 min chars
              </span>
            </div>
            <textarea
              rows="3"
              v-model="reportForm.description"
              @blur="reportTouched.description = true"
              placeholder="Describe distinguishing features, brand, stickers, color..."
              :class="[
                'w-full p-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none transition-all',
                reportTouched.description && reportErrors.description ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20' :
                reportTouched.description && !reportErrors.description ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 focus:border-blue-500'
              ]"
            ></textarea>
            <p v-if="reportTouched.description && reportErrors.description" class="text-[10px] text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
              <span>⚠️</span> {{ reportErrors.description }}
            </p>
          </div>

          <!-- PERSON CONTACT INFORMATION INPUTS WITH VALIDATION & AUTOFILL -->
          <div class="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h3 class="text-xs font-extrabold text-blue-900 uppercase">
                Who is the person reporting this? (Contact Details)
              </h3>
              <button
                type="button"
                @click="autoFillContact"
                class="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-0.5 rounded-md transition-colors"
              >
                Auto-fill My Profile Info
              </button>
            </div>

            <!-- Reporter Name -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[10px] font-bold text-slate-600 uppercase">Person Name *</label>
                <span v-if="reportTouched.reporterName && !reportErrors.reporterName" class="text-[10px] text-emerald-600 font-bold">
                  ✓ Valid
                </span>
              </div>
              <input
                type="text"
                v-model="reportForm.reporterName"
                @blur="reportTouched.reporterName = true"
                placeholder="e.g. Alex Rivera"
                :class="[
                  'w-full p-2 bg-white border rounded-lg text-xs focus:outline-none transition-all',
                  reportTouched.reporterName && reportErrors.reporterName ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20' :
                  reportTouched.reporterName && !reportErrors.reporterName ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 focus:border-blue-500'
                ]"
              />
              <p v-if="reportTouched.reporterName && reportErrors.reporterName" class="text-[10px] text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
                <span>⚠️</span> {{ reportErrors.reporterName }}
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <!-- Reporter Phone -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-[10px] font-bold text-slate-600 uppercase">Phone Number *</label>
                  <span v-if="reportTouched.reporterPhone && !reportErrors.reporterPhone" class="text-[10px] text-emerald-600 font-bold">
                    ✓ Valid
                  </span>
                </div>
                <input
                  type="tel"
                  v-model="reportForm.reporterPhone"
                  @blur="reportTouched.reporterPhone = true"
                  placeholder="e.g. +1 (555) 019-2831"
                  :class="[
                    'w-full p-2 bg-white border rounded-lg text-xs focus:outline-none transition-all',
                    reportTouched.reporterPhone && reportErrors.reporterPhone ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20' :
                    reportTouched.reporterPhone && !reportErrors.reporterPhone ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 focus:border-blue-500'
                  ]"
                />
                <p v-if="reportTouched.reporterPhone && reportErrors.reporterPhone" class="text-[10px] text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
                  <span>⚠️</span> {{ reportErrors.reporterPhone }}
                </p>
              </div>

              <!-- Reporter Email -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-[10px] font-bold text-slate-600 uppercase">Email Address *</label>
                  <span v-if="reportTouched.reporterEmail && !reportErrors.reporterEmail" class="text-[10px] text-emerald-600 font-bold">
                    ✓ Valid
                  </span>
                </div>
                <input
                  type="email"
                  v-model="reportForm.reporterEmail"
                  @blur="reportTouched.reporterEmail = true"
                  placeholder="e.g. alex.r@university.edu"
                  :class="[
                    'w-full p-2 bg-white border rounded-lg text-xs focus:outline-none transition-all',
                    reportTouched.reporterEmail && reportErrors.reporterEmail ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20' :
                    reportTouched.reporterEmail && !reportErrors.reporterEmail ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 focus:border-blue-500'
                  ]"
                />
                <p v-if="reportTouched.reporterEmail && reportErrors.reporterEmail" class="text-[10px] text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
                  <span>⚠️</span> {{ reportErrors.reporterEmail }}
                </p>
              </div>
            </div>
          </div>

          <!-- CATEGORY FILTER FOR PRESET IMAGES -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold text-slate-700 uppercase">Select Image Preset</label>
              <!-- Filter inside Report Item Modal -->
              <div class="flex items-center gap-1 text-[10px]">
                <span class="text-slate-400 font-medium">Filter image by category:</span>
                <select v-model="reportCategoryFilter" class="bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 font-bold text-slate-700 focus:outline-none">
                  <option value="ALL">All Categories</option>
                  <option value="ELECTRONICS">Electronics</option>
                  <option value="BAGS">Bags</option>
                  <option value="PERSONAL ITEMS">Personal Items</option>
                  <option value="BOOKS">Books</option>
                  <option value="KEYS">Keys</option>
                  <option value="PHONE">Phone</option>
                  <option value="STUDENT ID">ID Cards</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="(img, idx) in filteredPresetImages"
                :key="idx"
                type="button"
                @click="reportForm.imageUrl = img.url"
                :class="[
                  'h-16 rounded-xl overflow-hidden border-2 transition-all relative group',
                  reportForm.imageUrl === img.url ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200 hover:border-slate-300'
                ]"
              >
                <img :src="img.url" class="w-full h-full object-cover" />
                <span class="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] truncate px-1 py-0.5 text-center font-medium">
                  {{ img.name }}
                </span>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              @click="isReportModalOpen = false"
              class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Post Item Report
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

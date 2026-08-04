<script setup lang="ts">
import { ref, computed } from 'vue';

// Types
type ItemType = 'LOST' | 'FOUND';
type ActiveTab = 'dashboard' | 'report' | 'my-items' | 'settings';

interface CampusItem {
  id: string;
  title: string;
  type: ItemType;
  category: string;
  location: string;
  date: string;
  imageUrl: string;
  description?: string;
  reporterName?: string;
  reporterContact?: string;
  status: 'ACTIVE' | 'RECONNECTED' | 'IN_CLAIM';
  securityPost?: string;
}

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

// State
const activeTab = ref<ActiveTab>('dashboard');
const searchQuery = ref('');
const selectedCategory = ref<string | null>(null);
const isOpenMobileSidebar = ref(false);

// Modals
const selectedItemDetail = ref<CampusItem | null>(null);
const isReportModalOpen = ref(false);
const isContactSecurityOpen = ref(false);
const isCustomizeOpen = ref(false);
const showNotifications = ref(false);
const showProfileMenu = ref(false);

// Customization
const showStats = ref(true);
const itemsPerPage = ref(4);

// Claim Modal State inside Item Detail
const claimMessage = ref('');
const claimSent = ref(false);
const isSubmittingClaim = ref(false);

// Report Form State
const reportType = ref<ItemType>('LOST');
const reportTitle = ref('');
const reportCategory = ref('OTHER');
const reportLocation = ref('');
const reportDescription = ref('');
const reportImageUrl = ref('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80');

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
];

// Stats
const stats = ref({
  currentLost: 1428,
  recentFound: 964,
  reconnected: 782
});

// Categories with icons matching design
const categories = ref<CategoryItem[]>([
  { id: 'STUDENT ID', name: 'STUDENT ID', icon: 'id' },
  { id: 'WALLET', name: 'WALLET', icon: 'wallet' },
  { id: 'KEYS', name: 'KEYS', icon: 'key' },
  { id: 'LAPTOP', name: 'LAPTOP', icon: 'laptop' },
  { id: 'PHONE', name: 'PHONE', icon: 'phone' },
  { id: 'BACKPACK', name: 'BACKPACK', icon: 'bag' },
  { id: 'BOOKS', name: 'BOOKS', icon: 'book' },
  { id: 'CALCULATOR', name: 'CALCULATOR', icon: 'calc' },
  { id: 'WATER BOTTLE', name: 'WATER BOTTLE', icon: 'drop' },
  { id: 'HEADPHONES', name: 'HEADPHONES', icon: 'headphone' },
  { id: 'CLOTHING', name: 'CLOTHING', icon: 'shirt' },
  { id: 'OTHER', name: 'OTHER', icon: 'more' },
]);

// Initial Dataset
const items = ref<CampusItem[]>([
  // LATEST LOST ITEMS
  {
    id: 'lost-1',
    title: 'Leather Laptop',
    type: 'LOST',
    category: 'BACKPACK',
    location: 'Central Library, Level 2 Study Hall',
    date: 'Oct 27, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    description: 'Black genuine leather laptop sleeve/bag containing a 14-inch MacBook Air and class notebooks.',
    reporterName: 'Alex Rivera',
    reporterContact: 'alex.r@university.edu',
    status: 'ACTIVE',
    securityPost: 'Main Library Information Desk'
  },
  {
    id: 'lost-2',
    title: 'Sony Wireless',
    type: 'LOST',
    category: 'HEADPHONES',
    location: 'Student Union Cafeteria',
    date: 'Oct 26, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Matte black Sony WH-1000XM4 noise cancelling headphones left near table 12.',
    reporterName: 'Jordan Lee',
    reporterContact: 'jordan.l@university.edu',
    status: 'ACTIVE',
    securityPost: 'Student Union Security Post'
  },
  {
    id: 'lost-3',
    title: 'iPhone 15 Pro',
    type: 'LOST',
    category: 'PHONE',
    location: 'Engineering Building, Room 402',
    date: 'Oct 26, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    description: 'Natural Titanium iPhone 15 Pro with a clear case and university sticker on the back.',
    reporterName: 'Marcus Vance',
    reporterContact: 'm.vance@university.edu',
    status: 'ACTIVE',
    securityPost: 'Engineering Quad Office'
  },
  {
    id: 'lost-4',
    title: 'House Keys with',
    type: 'LOST',
    category: 'KEYS',
    location: 'University Sports Complex',
    date: 'Oct 25, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    description: 'Set of 4 keys on a blue University Athletics lanyard with a silver carabiner.',
    reporterName: 'Samantha Green',
    reporterContact: 'sgreen@university.edu',
    status: 'ACTIVE',
    securityPost: 'Gym Reception'
  },

  // RECENTLY FOUND
  {
    id: 'found-1',
    title: 'Student ID Card -',
    type: 'FOUND',
    category: 'STUDENT ID',
    location: 'Science Quad Walkway',
    date: 'Oct 28, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    description: 'Student ID on a red Volunteer lanyard. Turned in to security booth.',
    reporterName: 'Campus Security',
    reporterContact: 'security@university.edu',
    status: 'ACTIVE',
    securityPost: 'Main Security (24/7)'
  },
  {
    id: 'found-2',
    title: 'Blue Hydroflask',
    type: 'FOUND',
    category: 'WATER BOTTLE',
    location: 'Fine Arts Theater Lobby',
    date: 'Oct 27, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    description: '32oz Cobalt Blue Hydroflask with multiple climbing stickers on the side.',
    reporterName: 'Facility Staff',
    reporterContact: 'finearts.sec@university.edu',
    status: 'ACTIVE',
    securityPost: 'Fine Arts Information Desk'
  },
  {
    id: 'found-3',
    title: 'TI-84 Graphing',
    type: 'FOUND',
    category: 'CALCULATOR',
    location: 'Math Center, Hallway C',
    date: 'Oct 27, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    description: 'Black TI-84 Plus CE graphing calculator with "STAT 101" written in metallic sharpie inside slide cover.',
    reporterName: 'Prof. Miller',
    reporterContact: 'math.dept@university.edu',
    status: 'ACTIVE',
    securityPost: 'Math Dept Admin Office'
  },
  {
    id: 'found-4',
    title: 'Organic Chemistry',
    type: 'FOUND',
    category: 'BOOKS',
    location: 'Bus Stop, Main Entrance',
    date: 'Oct 26, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: 'Stack of 3 chemistry textbooks bound by a strap. Found on the bench at Main Gate stop.',
    reporterName: 'Transit Guard',
    reporterContact: 'transit@university.edu',
    status: 'ACTIVE',
    securityPost: 'Main Gate Security Gatehouse'
  }
]);

// Computed Filters
const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q));

    const matchesCategory =
      !selectedCategory.value || item.category === selectedCategory.value;

    return matchesSearch && matchesCategory;
  });
});

const lostItems = computed(() => {
  return filteredItems.value.filter((i) => i.type === 'LOST').slice(0, itemsPerPage.value);
});

const foundItems = computed(() => {
  return filteredItems.value.filter((i) => i.type === 'FOUND').slice(0, itemsPerPage.value);
});

// Methods
const toggleCategory = (catName: string) => {
  if (selectedCategory.value === catName) {
    selectedCategory.value = null;
  } else {
    selectedCategory.value = catName;
  }
};

const openItemModal = (item: CampusItem) => {
  selectedItemDetail.value = item;
  claimSent.value = false;
  claimMessage.value = '';
};

const handleClaim = () => {
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
  if (!reportTitle.value.trim() || !reportLocation.value.trim()) return;

  const newItem: CampusItem = {
    id: `reported-${Date.now()}`,
    title: reportTitle.value.trim(),
    type: reportType.value,
    category: reportCategory.value,
    location: reportLocation.value.trim(),
    date: 'Just Now',
    imageUrl: reportImageUrl.value,
    description: reportDescription.value.trim(),
    reporterName: 'Alex Rivera',
    reporterContact: 'alex.r@university.edu',
    status: 'ACTIVE',
    securityPost: 'Main Security Booth (24/7)'
  };

  items.value.unshift(newItem);

  if (reportType.value === 'LOST') {
    stats.value.currentLost += 1;
  } else {
    stats.value.recentFound += 1;
  }

  isReportModalOpen.value = false;
  reportTitle.value = '';
  reportLocation.value = '';
  reportDescription.value = '';
};

const deleteMyItem = (itemId: string) => {
  items.value = items.value.filter((i) => i.id !== itemId);
};
</script>

<template>
  <div class="min-h-screen bg-[#f1f3f6] text-gray-900 font-sans antialiased flex flex-col lg:flex-row selection:bg-blue-500 selection:text-white">
    
    <!-- LEFT SIDEBAR -->
    <aside class="hidden lg:flex w-60 bg-[#e7eaee] border-r border-gray-200/90 p-4 flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen">
      <div class="space-y-6">
        <!-- Sidebar Navigation -->
        <nav class="space-y-1 pt-1">
          <!-- Dashboard -->
          <button
            @click="activeTab = 'dashboard'"
            :class="[
              'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
              activeTab === 'dashboard'
                ? 'bg-[#d5deed] text-[#1a365d] shadow-2xs font-bold'
                : 'text-gray-600 hover:bg-gray-200/70 hover:text-gray-900'
            ]"
          >
            <svg class="w-4 h-4 shrink-0 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            <span>Dashboard</span>
          </button>

          <!-- Report Item -->
          <button
            @click="isReportModalOpen = true"
            class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200/70 hover:text-gray-900 transition-all cursor-pointer"
          >
            <svg class="w-4 h-4 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Report Item</span>
          </button>

          <!-- My Items -->
          <button
            @click="activeTab = 'my-items'"
            :class="[
              'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
              activeTab === 'my-items'
                ? 'bg-[#d5deed] text-[#1a365d] shadow-2xs font-bold'
                : 'text-gray-600 hover:bg-gray-200/70 hover:text-gray-900'
            ]"
          >
            <svg class="w-4 h-4 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <span>My Items</span>
          </button>

          <!-- Settings -->
          <button
            @click="activeTab = 'settings'"
            :class="[
              'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
              activeTab === 'settings'
                ? 'bg-[#d5deed] text-[#1a365d] shadow-2xs font-bold'
                : 'text-gray-600 hover:bg-gray-200/70 hover:text-gray-900'
            ]"
          >
            <svg class="w-4 h-4 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            </svg>
            <span>Settings</span>
          </button>
        </nav>
      </div>

      <!-- Bottom Profile Card -->
      <div class="pt-3 border-t border-gray-300/60 flex items-center justify-between gap-2">
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold text-gray-900 truncate">Alex Rivera</p>
          <p class="text-[11px] text-gray-500 truncate">alex.r@university.edu</p>
        </div>
        <button class="p-1.5 text-gray-400 hover:text-gray-700 transition-colors shrink-0 cursor-pointer" title="Sign out">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </button>
      </div>
    </aside>

    <!-- Mobile Drawer Sidebar -->
    <div v-if="isOpenMobileSidebar" class="fixed inset-0 z-50 lg:hidden flex">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-xs" @click="isOpenMobileSidebar = false" />
      <div class="relative z-10 w-64 max-w-xs bg-white h-full p-4 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-200">
            <span class="font-bold text-gray-900 text-sm">Campus Finders</span>
            <button @click="isOpenMobileSidebar = false" class="p-1 rounded-md text-gray-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <nav class="space-y-2">
            <button @click="activeTab = 'dashboard'; isOpenMobileSidebar = false" class="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg">Dashboard</button>
            <button @click="isReportModalOpen = true; isOpenMobileSidebar = false" class="w-full text-left px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg">+ Report Item</button>
            <button @click="activeTab = 'my-items'; isOpenMobileSidebar = false" class="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg">My Items</button>
            <button @click="activeTab = 'settings'; isOpenMobileSidebar = false" class="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg">Settings</button>
          </nav>
        </div>
      </div>
    </div>

    <!-- RIGHT MAIN CONTENT COLUMN -->
    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- Top Header / Navbar -->
      <header class="bg-[#f8fafc] border-b border-gray-200/90 px-4 sm:px-6 py-3.5 sticky top-0 z-30 transition-all">
        <div class="flex items-center justify-between gap-4">
          
          <!-- Left: Mobile menu button + Logo -->
          <div class="flex items-center gap-3">
            <button
              @click="isOpenMobileSidebar = true"
              class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Open Menu"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <span class="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                Campus Finders
              </span>
            </div>
          </div>

          <!-- Center: Search bar -->
          <div class="flex-1 max-w-md mx-2">
            <div class="relative">
              <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search lost items..."
                class="w-full pl-10 pr-9 py-2 bg-[#e8ecf0] focus:bg-white text-xs text-gray-800 placeholder-gray-400 rounded-full border border-transparent focus:border-blue-400 focus:outline-none transition-all"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Right: Notifications & User button -->
          <div class="flex items-center gap-3 shrink-0">
            <!-- Notifications Button -->
            <div class="relative">
              <button
                @click="showNotifications = !showNotifications; showProfileMenu = false"
                class="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-200/50 transition-colors cursor-pointer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
              </button>

              <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
                <div class="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-900">Notifications</span>
                  <span class="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">2 New</span>
                </div>
                <div class="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  <div class="p-3 bg-blue-50/40 hover:bg-gray-50">
                    <p class="text-xs font-bold text-gray-900">Item Match Found!</p>
                    <p class="text-[11px] text-gray-600 mt-0.5">A water bottle matching your report was uploaded at Fine Arts Theater.</p>
                  </div>
                  <div class="p-3 hover:bg-gray-50">
                    <p class="text-xs font-bold text-gray-900">Security Guard Desk</p>
                    <p class="text-[11px] text-gray-600 mt-0.5">Library desk logged 12 new items today.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- User Pill -->
            <button
              @click="showProfileMenu = !showProfileMenu; showNotifications = false"
              class="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200/90 rounded-full text-xs font-medium text-gray-800 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div class="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <span>Alex Student</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Body Container -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 space-y-10 max-w-7xl w-full mx-auto min-w-0">
        
        <!-- Active Filter Bar -->
        <div v-if="searchQuery || selectedCategory" class="p-3 bg-blue-50/90 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-semibold text-blue-900">Active Filters:</span>
            <span v-if="searchQuery" class="bg-white border border-blue-200 px-2.5 py-0.5 rounded-full font-medium text-blue-800">
              "{{ searchQuery }}"
            </span>
            <span v-if="selectedCategory" class="bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-semibold uppercase">
              Category: {{ selectedCategory }}
            </span>
          </div>
          <button @click="searchQuery = ''; selectedCategory = null" class="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer">
            Clear All
          </button>
        </div>

        <!-- TAB 1: DASHBOARD -->
        <div v-if="activeTab === 'dashboard'" class="space-y-10">
          
          <!-- HERO BANNER SECTION -->
          <section v-if="showStats" class="relative rounded-3xl overflow-hidden shadow-xs">
            <div
              class="relative bg-cover bg-center py-12 px-6 sm:px-12 text-center text-white min-h-[380px] flex flex-col justify-center items-center"
              style="background-image: linear-gradient(to bottom, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80')"
            >
              <!-- Top Support Badge -->
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-bold tracking-wider text-white/90 uppercase mb-4">
                <svg class="w-3.5 h-3.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>CAMPUS SUPPORT SYSTEM</span>
              </div>

              <!-- Main Heading -->
              <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight mb-3">
                Helping Students Reconnect with Their Belongings
              </h1>

              <!-- Subtitle -->
              <p class="text-xs sm:text-sm text-gray-200 max-w-2xl leading-relaxed mb-8">
                Lost your keys? Found a phone? Join thousands of students who use our secure campus network to return items to their rightful owners quickly and efficiently.
              </p>

              <!-- Capsule Search & Button Bar -->
              <div class="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-2 bg-white/95 p-1.5 pl-4 rounded-full shadow-xl border border-white/30">
                <div class="relative flex-1 w-full flex items-center">
                  <svg class="w-4 h-4 text-gray-400 shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Search for your lost item (e.g. 'blue wallet')"
                    class="w-full bg-transparent text-gray-900 text-xs sm:text-sm focus:outline-none placeholder-gray-400 font-medium py-2"
                  />
                </div>
                <button
                  @click="isReportModalOpen = true"
                  class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-full transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <span>Report New Item</span>
                </button>
              </div>
            </div>

            <!-- Stat Cards Bar -->
            <div class="bg-[#e7eaee]/70 p-4 sm:p-6 border-t border-gray-200/60">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
                
                <!-- Stat Card 1 -->
                <div class="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-gray-200/80 text-gray-600 flex items-center justify-center shrink-0">
                    <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold tracking-wider text-gray-400 uppercase">CURRENT LOST ITEMS</p>
                    <p class="text-xl sm:text-2xl font-black text-gray-900">{{ stats.currentLost.toLocaleString() }}</p>
                  </div>
                </div>

                <!-- Stat Card 2 -->
                <div class="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs flex items-center gap-4 border-l-4 border-l-blue-600">
                  <div class="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/20">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold tracking-wider text-gray-400 uppercase">RECENT FOUND ITEMS</p>
                    <p class="text-xl sm:text-2xl font-black text-gray-900">{{ stats.recentFound.toLocaleString() }}</p>
                  </div>
                </div>

                <!-- Stat Card 3 -->
                <div class="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs flex items-center gap-4 border-l-4 border-l-emerald-500">
                  <div class="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs shadow-emerald-500/20">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold tracking-wider text-gray-400 uppercase">ITEMS RECONNECTED</p>
                    <p class="text-xl sm:text-2xl font-black text-gray-900">{{ stats.reconnected.toLocaleString() }}</p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <!-- BROWSE BY CATEGORY SECTION -->
          <section>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 class="text-xl font-bold text-gray-900 tracking-tight">Browse by Category</h2>
                <p class="text-xs text-gray-500 mt-0.5">
                  Find your items faster by searching through dedicated university classifications.
                </p>
              </div>
              <button
                @click="isCustomizeOpen = true"
                class="self-start sm:self-auto text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Customize Dashboard</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                </svg>
              </button>
            </div>

            <!-- Categories Grid (6 columns) -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="toggleCategory(cat.name)"
                :class="[
                  'p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer relative group',
                  selectedCategory === cat.name
                    ? 'bg-blue-50/90 border-blue-500 text-blue-700 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-gray-200/80 hover:border-blue-300 hover:shadow-2xs text-gray-800'
                ]"
              >
                <!-- Category Icon Box -->
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                    selectedCategory === cat.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                  ]"
                >
                  <!-- ID Icon -->
                  <svg v-if="cat.icon === 'id'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4"/>
                  </svg>
                  <!-- Wallet Icon -->
                  <svg v-else-if="cat.icon === 'wallet'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <!-- Keys Icon -->
                  <svg v-else-if="cat.icon === 'key'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                  <!-- Laptop Icon -->
                  <svg v-else-if="cat.icon === 'laptop'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <!-- Phone Icon -->
                  <svg v-else-if="cat.icon === 'phone'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                  <!-- Backpack Icon -->
                  <svg v-else-if="cat.icon === 'bag'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  <!-- Books Icon -->
                  <svg v-else-if="cat.icon === 'book'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  <!-- Calculator Icon -->
                  <svg v-else-if="cat.icon === 'calc'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                  <!-- Water Bottle Icon -->
                  <svg v-else-if="cat.icon === 'drop'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 3H9L8 4z"/>
                  </svg>
                  <!-- Headphones Icon -->
                  <svg v-else-if="cat.icon === 'headphone'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 00-14 0m14 0a3 3 0 013 3v3a3 3 0 01-3 3h-1m-12-9a3 3 0 00-3 3v3a3 3 0 003 3h1m0 0a2 2 0 002-2v-4a2 2 0 00-2-2m12 8a2 2 0 002-2v-4a2 2 0 00-2-2"/>
                  </svg>
                  <!-- Clothing Icon -->
                  <svg v-else-if="cat.icon === 'shirt'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a2 2 0 01-2 2H7zm7-16h4a2 2 0 012 2v12a2 2 0 01-2 2h-4V5z"/>
                  </svg>
                  <!-- Other Icon -->
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                  </svg>
                </div>

                <span class="text-[11px] font-bold tracking-wider text-gray-800 uppercase">
                  {{ cat.name }}
                </span>
              </button>
            </div>
          </section>

          <!-- LATEST LOST ITEMS SECTION -->
          <section class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                  <h2 class="text-xl font-bold text-gray-900 tracking-tight">
                    Latest Lost Items
                  </h2>
                </div>
                <p class="text-xs text-gray-500 mt-0.5">
                  Newly reported items missing across campus grounds and buildings.
                </p>
              </div>

              <button
                @click="searchQuery = ''; selectedCategory = null"
                class="self-start sm:self-auto px-4 py-1.5 bg-gray-200/80 hover:bg-gray-300/80 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View All Lost Reports</span>
                <span class="text-sm">→</span>
              </button>
            </div>

            <div v-if="lostItems.length === 0" class="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <p class="text-xs text-gray-500 font-medium">No lost items match your search filter.</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="item in lostItems"
                :key="item.id"
                class="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
              >
                <!-- Image Header -->
                <div class="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img :src="item.imageUrl" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span class="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white bg-slate-700">
                    LOST
                  </span>
                </div>

                <!-- Content Body -->
                <div class="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{{ item.category }}</span>
                    <h3 class="text-sm font-bold text-gray-900 mt-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {{ item.title }}
                    </h3>
                    <div class="mt-3 space-y-1.5 text-xs text-gray-500">
                      <div class="flex items-center gap-1.5 line-clamp-1">
                        <svg class="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        <span class="truncate">{{ item.location }}</span>
                      </div>
                      <div class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>{{ item.date }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Detail Button -->
                  <div class="mt-4 pt-3 border-t border-gray-100">
                    <button
                      @click="openItemModal(item)"
                      class="w-full py-2 px-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all border border-gray-200/60 cursor-pointer"
                    >
                      <span>View Details</span>
                      <span class="text-xs">›</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- RECENTLY FOUND SECTION -->
          <section class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <h2 class="text-xl font-bold text-gray-900 tracking-tight">
                    Recently Found
                  </h2>
                </div>
                <p class="text-xs text-gray-500 mt-0.5">
                  Items picked up by faculty and students, currently held at security checkpoints.
                </p>
              </div>

              <button
                @click="searchQuery = ''; selectedCategory = null"
                class="self-start sm:self-auto px-4 py-1.5 bg-blue-50 hover:bg-blue-100/80 rounded-full text-xs font-semibold text-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Browse All Found Items</span>
                <span class="text-sm">→</span>
              </button>
            </div>

            <div v-if="foundItems.length === 0" class="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <p class="text-xs text-gray-500 font-medium">No found items match your search filter.</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="item in foundItems"
                :key="item.id"
                class="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
              >
                <!-- Image Header -->
                <div class="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img :src="item.imageUrl" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span class="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white bg-blue-600">
                    FOUND
                  </span>
                </div>

                <!-- Content Body -->
                <div class="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{{ item.category }}</span>
                    <h3 class="text-sm font-bold text-gray-900 mt-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {{ item.title }}
                    </h3>
                    <div class="mt-3 space-y-1.5 text-xs text-gray-500">
                      <div class="flex items-center gap-1.5 line-clamp-1">
                        <svg class="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        <span class="truncate">{{ item.location }}</span>
                      </div>
                      <div class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>{{ item.date }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Detail Button -->
                  <div class="mt-4 pt-3 border-t border-gray-100">
                    <button
                      @click="openItemModal(item)"
                      class="w-full py-2 px-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all border border-gray-200/60 cursor-pointer"
                    >
                      <span>View Details</span>
                      <span class="text-xs">›</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        <!-- TAB 2: MY ITEMS -->
        <div v-if="activeTab === 'my-items'" class="space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h1 class="text-2xl font-black text-gray-900">My Reported Items</h1>
              <p class="text-xs text-gray-500">Manage lost or found items submitted by Alex Rivera.</p>
            </div>
            <button
              @click="isReportModalOpen = true"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <span>+ Report New Item</span>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="item in items.filter(i => i.reporterName === 'Alex Rivera' || i.id.startsWith('reported-'))"
              :key="item.id"
              class="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs relative"
            >
              <div class="flex gap-3">
                <img :src="item.imageUrl" :alt="item.title" class="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div class="flex-1 min-w-0">
                  <span class="text-[10px] font-extrabold text-blue-600 uppercase">{{ item.type }} • {{ item.category }}</span>
                  <h3 class="text-xs font-bold text-gray-900 truncate">{{ item.title }}</h3>
                  <p class="text-[11px] text-gray-500 truncate mt-0.5">{{ item.location }}</p>
                  <span class="mt-1 inline-block px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-[10px] font-semibold">
                    Status: {{ item.status }}
                  </span>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <button @click="openItemModal(item)" class="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                  View Details
                </button>
                <button @click="deleteMyItem(item.id)" class="text-xs text-rose-500 hover:text-rose-700 p-1 rounded cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: SETTINGS -->
        <div v-if="activeTab === 'settings'" class="max-w-2xl bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-6">
          <div>
            <h1 class="text-xl font-bold text-gray-900">Campus Account Settings</h1>
            <p class="text-xs text-gray-500">Configure notification preferences and primary campus hub.</p>
          </div>

          <div class="space-y-4 pt-2">
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <h3 class="text-xs font-bold text-gray-700 uppercase">Student Profile</h3>
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span class="text-gray-400 block">Name</span>
                  <span class="font-semibold text-gray-900">Alex Rivera</span>
                </div>
                <div>
                  <span class="text-gray-400 block">University Email</span>
                  <span class="font-semibold text-gray-900">alex.r@university.edu</span>
                </div>
              </div>
            </div>

            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-gray-900">Instant Email Notifications</p>
                <p class="text-[11px] text-gray-500">Get notified immediately when an item matching your lost report is found.</p>
              </div>
              <input type="checkbox" checked class="w-4 h-4 text-blue-600 rounded" />
            </div>
          </div>
        </div>

        <!-- FOOTER -->
        <footer class="mt-16 border-t border-gray-200/80 bg-white/70 rounded-3xl p-6 sm:p-8 text-gray-600">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-gray-200/80">
            
            <!-- Brand Column -->
            <div class="space-y-3">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <span class="text-base font-bold text-gray-900 tracking-tight">Campus Finders</span>
              </div>
              <p class="text-xs text-gray-500 leading-relaxed">
                The official University Lost & Found digital companion. Dedicated to reconnecting our academic community one item at a time.
              </p>
            </div>

            <!-- Quick Links -->
            <div>
              <h4 class="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">QUICK LINKS</h4>
              <ul class="space-y-2 text-xs">
                <li><button @click="isReportModalOpen = true" class="hover:text-blue-600 cursor-pointer">Report an Item</button></li>
                <li><button @click="activeTab = 'dashboard'" class="hover:text-blue-600 cursor-pointer">Search Database</button></li>
                <li><a href="#privacy" class="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#terms" class="hover:text-blue-600">Terms of Use</a></li>
              </ul>
            </div>

            <!-- Security Posts -->
            <div>
              <h4 class="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">SECURITY POSTS</h4>
              <ul class="space-y-2 text-xs text-gray-500">
                <li>Main Security (24/7)</li>
                <li>Library Information Desk</li>
                <li>Student Union Office</li>
                <li>Gym Reception</li>
              </ul>
            </div>

            <!-- Help & Support -->
            <div>
              <h4 class="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">HELP & SUPPORT</h4>
              <p class="text-xs text-gray-500 leading-relaxed mb-3">Found something urgent like a wallet or phone? Call our hotline.</p>
              <button
                @click="isContactSecurityOpen = true"
                class="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                Contact Security Support
              </button>
            </div>

          </div>

          <!-- Bottom Footer Bar -->
          <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <p>© 2026 University Campus Finders. All rights reserved.</p>
            <div class="flex items-center gap-4 text-[11px]">
              <a href="#accessibility" class="hover:text-gray-600">Accessibility Statement</a>
              <span>•</span>
              <a href="#cookies" class="hover:text-gray-600">Cookie Policy</a>
              <span>•</span>
              <a href="#handbook" class="hover:text-gray-600">Student Handbook</a>
            </div>
          </div>
        </footer>

      </main>
    </div>

    <!-- ITEM DETAIL MODAL -->
    <div v-if="selectedItemDetail" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative overflow-hidden">
        <div class="relative h-64 w-full bg-gray-900">
          <img :src="selectedItemDetail.imageUrl" :alt="selectedItemDetail.title" class="w-full h-full object-cover opacity-90" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <button @click="selectedItemDetail = null" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center cursor-pointer">
            ✕
          </button>

          <div class="absolute top-4 left-4 flex gap-2">
            <span :class="['px-3 py-1 rounded-full text-xs font-black uppercase text-white', selectedItemDetail.type === 'LOST' ? 'bg-slate-700' : 'bg-blue-600']">
              {{ selectedItemDetail.type }} ITEM
            </span>
            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/20 text-white backdrop-blur-md">
              {{ selectedItemDetail.category }}
            </span>
          </div>

          <div class="absolute bottom-4 left-6 right-6 text-white">
            <h2 class="text-2xl font-black tracking-tight">{{ selectedItemDetail.title }}</h2>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase">Location</p>
              <p class="text-xs font-semibold text-gray-800">{{ selectedItemDetail.location }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase">Report Date</p>
              <p class="text-xs font-semibold text-gray-800">{{ selectedItemDetail.date }}</p>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
            <p class="text-sm text-gray-700 bg-white p-3 rounded-xl border border-gray-100">
              {{ selectedItemDetail.description || 'No additional details provided.' }}
            </p>
          </div>

          <div class="bg-blue-50/60 rounded-2xl p-4 border border-blue-100">
            <p class="font-bold text-xs text-blue-900">Campus Security Station</p>
            <p class="text-xs text-blue-700 mt-0.5">Held at: {{ selectedItemDetail.securityPost || 'Main Security Desk (24/7)' }}</p>
          </div>

          <div class="border-t border-gray-100 pt-4">
            <div v-if="claimSent" class="bg-emerald-50 text-emerald-800 p-4 rounded-2xl">
              <p class="text-xs font-bold">Inquiry Sent!</p>
              <p class="text-xs mt-0.5">Campus security and the reporter have been notified.</p>
            </div>
            <form v-else @submit.prevent="handleClaim" class="space-y-3">
              <h3 class="text-xs font-bold text-gray-900 uppercase">Submit Claim Inquiry</h3>
              <textarea
                required
                rows="3"
                v-model="claimMessage"
                placeholder="Describe distinguishing marks or proof of ownership..."
                class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <div class="flex justify-end">
                <button type="submit" :disabled="isSubmittingClaim" class="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">
                  {{ isSubmittingClaim ? 'Sending...' : 'Submit Claim Request' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- REPORT MODAL -->
    <div v-if="isReportModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Report an Item</h2>
            <p class="text-xs text-gray-500">Log a lost or found item into the campus network.</p>
          </div>
          <button @click="isReportModalOpen = false" class="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="handleAddReport" class="mt-5 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Report Type</label>
            <div class="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                @click="reportType = 'LOST'"
                :class="['py-2 rounded-lg text-xs font-bold cursor-pointer', reportType === 'LOST' ? 'bg-slate-800 text-white' : 'text-gray-600']"
              >
                LOST ITEM
              </button>
              <button
                type="button"
                @click="reportType = 'FOUND'"
                :class="['py-2 rounded-lg text-xs font-bold cursor-pointer', reportType === 'FOUND' ? 'bg-blue-600 text-white' : 'text-gray-600']"
              >
                FOUND ITEM
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Item Title</label>
            <input
              type="text"
              required
              v-model="reportTitle"
              placeholder="e.g., Sony Noise Cancelling Headphones"
              class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
              <select v-model="reportCategory" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
              <input
                type="text"
                required
                v-model="reportLocation"
                placeholder="e.g., Student Union Level 2"
                class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
            <textarea
              rows="3"
              v-model="reportDescription"
              placeholder="Details, color, stickers..."
              class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Select Image</label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="(img, idx) in PRESET_IMAGES"
                :key="idx"
                type="button"
                @click="reportImageUrl = img"
                :class="['h-16 rounded-xl overflow-hidden border-2 cursor-pointer', reportImageUrl === img ? 'border-blue-600' : 'border-gray-200']"
              >
                <img :src="img" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <div class="pt-3 flex justify-end gap-2 border-t border-gray-100">
            <button type="button" @click="isReportModalOpen = false" class="px-4 py-2 text-xs font-semibold text-gray-600 cursor-pointer">Cancel</button>
            <button type="submit" class="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer">Post Report</button>
          </div>
        </form>
      </div>
    </div>

    <!-- CONTACT SECURITY MODAL -->
    <div v-if="isContactSecurityOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-xl w-full p-6 relative">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900">Campus Security Posts</h2>
          <button @click="isContactSecurityOpen = false" class="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
        </div>

        <div class="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-amber-900">Urgent Lost Item Hotline</p>
            <p class="text-[11px] text-amber-700">Passports, IDs, or laptops?</p>
          </div>
          <a href="tel:5550192831" class="px-3.5 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl">Call 24/7</a>
        </div>

        <div class="mt-4 space-y-3">
          <div class="p-3 bg-blue-50/50 rounded-2xl border border-blue-200">
            <p class="text-xs font-bold text-gray-900">Main Campus Security Desk (24/7)</p>
            <p class="text-xs text-gray-600">Administrative Building, Room 101 • (555) 019-2831</p>
          </div>
          <div class="p-3 bg-gray-50 rounded-2xl border border-gray-200">
            <p class="text-xs font-bold text-gray-900">Library Information Desk</p>
            <p class="text-xs text-gray-600">Central Library, Ground Floor • (555) 019-2832</p>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button @click="isContactSecurityOpen = false" class="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl cursor-pointer">Close</button>
        </div>
      </div>
    </div>

    <!-- CUSTOMIZE MODAL -->
    <div v-if="isCustomizeOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 relative">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-900">Customize Dashboard</h2>
          <button @click="isCustomizeOpen = false" class="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
        </div>

        <div class="mt-5 space-y-5">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p class="text-xs font-bold text-gray-900">Show Summary Counter Cards</p>
              <p class="text-[11px] text-gray-500">Display lost, found & reconnected metrics banner.</p>
            </div>
            <button
              @click="showStats = !showStats"
              :class="['w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer', showStats ? 'bg-blue-600' : 'bg-gray-300']"
            >
              <div :class="['bg-white w-4 h-4 rounded-full shadow-md transform transition-transform', showStats ? 'translate-x-6' : 'translate-x-0']" />
            </button>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Items per Section</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="num in [4, 8, 12]"
                :key="num"
                @click="itemsPerPage = num"
                :class="['py-2 rounded-xl text-xs font-bold border cursor-pointer', itemsPerPage === num ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-gray-200']"
              >
                {{ num }} Items
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button @click="isCustomizeOpen = false" class="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

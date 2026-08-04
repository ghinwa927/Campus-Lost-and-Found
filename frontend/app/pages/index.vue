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
  iconName: string;
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

// Categories
const categories = ref<CategoryItem[]>([
  { id: 'STUDENT ID', name: 'STUDENT ID', iconName: 'id' },
  { id: 'WALLET', name: 'WALLET', iconName: 'wallet' },
  { id: 'KEYS', name: 'KEYS', iconName: 'key' },
  { id: 'LAPTOP', name: 'LAPTOP', iconName: 'laptop' },
  { id: 'PHONE', name: 'PHONE', iconName: 'phone' },
  { id: 'BACKPACK', name: 'BACKPACK', iconName: 'bag' },
  { id: 'BOOKS', name: 'BOOKS', iconName: 'book' },
  { id: 'CALCULATOR', name: 'CALCULATOR', iconName: 'calc' },
  { id: 'WATER BOTTLE', name: 'WATER BOTTLE', iconName: 'drop' },
  { id: 'HEADPHONES', name: 'HEADPHONES', iconName: 'headphone' },
  { id: 'CLOTHING', name: 'CLOTHING', iconName: 'shirt' },
  { id: 'OTHER', name: 'OTHER', iconName: 'more' },
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
  <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans antialiased flex flex-col selection:bg-blue-500 selection:text-white">
    <!-- Navbar Header -->
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <!-- Left Logo & Mobile Toggle -->
        <div className="flex items-center gap-3">
          <button
            @click="isOpenMobileSidebar = true"
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
            aria-label="Open Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight hidden sm:inline-block">
              Campus Finders
            </span>
          </div>
        </div>

        <!-- Center Search Bar -->
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search lost items..."
              className="w-full pl-10 pr-9 py-2 bg-gray-50 hover:bg-gray-100/80 focus:bg-white text-sm text-gray-900 placeholder-gray-400 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Right User Actions -->
        <div className="flex items-center gap-2 sm:gap-3">
          <!-- 24/7 Security Button -->
          <button
            @click="isContactSecurityOpen = true"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/60"
          >
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span>Security 24/7</span>
          </button>

          <!-- Notifications Button & Dropdown -->
          <div className="relative">
            <button
              @click="showNotifications = !showNotifications; showProfileMenu = false"
              className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
            </button>

            <div v-if="showNotifications" className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
              <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Notifications</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">2 New</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                <div className="p-3.5 bg-blue-50/30 hover:bg-gray-50">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-900">Item Match Found!</span>
                    <span className="text-[10px] text-gray-400">10m ago</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">A blue water bottle matching your description was submitted at Fine Arts Lobby.</p>
                </div>
                <div className="p-3.5 hover:bg-gray-50">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-900">Security Alert</span>
                    <span className="text-[10px] text-gray-400">1h ago</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Main library study hall sweep completed. 14 items logged to database.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- User Badge -->
          <div className="relative">
            <button
              @click="showProfileMenu = !showProfileMenu; showNotifications = false"
              className="flex items-center gap-2 pl-2 pr-3 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                AR
              </div>
              <span className="text-xs font-medium text-gray-800 hidden sm:inline-block">
                Alex Student
              </span>
            </button>

            <div v-if="showProfileMenu" className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-900">Alex Rivera</p>
                <p className="text-[11px] text-gray-500">alex.r@university.edu</p>
              </div>
              <button
                @click="showProfileMenu = false; isReportModalOpen = true"
                className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between"
              >
                <span>Report Lost Item</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <div className="flex-1 max-w-7xl w-full mx-auto flex gap-0 lg:gap-6">
      <!-- Desktop Sidebar -->
      <aside className="hidden lg:block w-60 shrink-0 min-h-[calc(100vh-61px)]">
        <div className="h-full flex flex-col justify-between p-4 bg-[#f3f4f6]/80 backdrop-blur-md border-r border-gray-200/80 w-64 text-gray-700">
          <div className="space-y-6">
            <nav className="space-y-1.5">
              <button
                @click="activeTab = 'dashboard'"
                :className="`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'dashboard' ? 'bg-blue-100/70 text-blue-700 shadow-xs' : 'text-gray-600 hover:bg-gray-200/50'
                }`"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
                <span>Dashboard</span>
              </button>

              <button
                @click="isReportModalOpen = true"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200/50"
              >
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Report Item</span>
              </button>

              <button
                @click="activeTab = 'my-items'"
                :className="`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'my-items' ? 'bg-blue-100/70 text-blue-700 shadow-xs' : 'text-gray-600 hover:bg-gray-200/50'
                }`"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                <span>My Items</span>
              </button>

              <button
                @click="activeTab = 'settings'"
                :className="`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'settings' ? 'bg-blue-100/70 text-blue-700 shadow-xs' : 'text-gray-600 hover:bg-gray-200/50'
                }`"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                </svg>
                <span>Settings</span>
              </button>
            </nav>
          </div>

          <!-- Bottom Profile Pill -->
          <div className="pt-4 border-t border-gray-200/80">
            <div className="flex items-center justify-between p-2 rounded-xl bg-gray-100/60 border border-gray-200/50">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  AR
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">Alex Rivera</p>
                  <p className="text-[11px] text-gray-500 truncate">alex.r@university.edu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Mobile Drawer Sidebar -->
      <div v-if="isOpenMobileSidebar" className="fixed inset-0 z-50 lg:hidden flex">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" @click="isOpenMobileSidebar = false" />
        <div className="relative z-10 w-64 max-w-xs bg-white h-full p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="font-bold text-gray-900 text-sm">Navigation</span>
              <button @click="isOpenMobileSidebar = false" className="p-1 rounded-md text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <nav className="space-y-2">
              <button @click="activeTab = 'dashboard'; isOpenMobileSidebar = false" className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg">Dashboard</button>
              <button @click="isReportModalOpen = true; isOpenMobileSidebar = false" className="w-full text-left px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg">+ Report Item</button>
              <button @click="activeTab = 'my-items'; isOpenMobileSidebar = false" className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg">My Items</button>
              <button @click="activeTab = 'settings'; isOpenMobileSidebar = false" className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg">Settings</button>
            </nav>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <main className="flex-1 p-4 sm:p-6 lg:pl-0 lg:pr-6 min-w-0">
        <!-- Active Filter Indicator -->
        <div v-if="searchQuery || selectedCategory" className="mb-6 p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-blue-900">Active Filters:</span>
            <span v-if="searchQuery" className="bg-white border border-blue-200 px-2.5 py-0.5 rounded-full font-medium text-blue-800">
              "{{ searchQuery }}"
            </span>
            <span v-if="selectedCategory" className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-semibold uppercase">
              Category: {{ selectedCategory }}
            </span>
          </div>
          <button @click="searchQuery = ''; selectedCategory = null" className="text-xs font-bold text-blue-700 hover:text-blue-900">
            Clear All
          </button>
        </div>

        <!-- TAB 1: DASHBOARD -->
        <div v-if="activeTab === 'dashboard'">
          <!-- Hero Banner -->
          <section v-if="showStats" className="relative rounded-3xl overflow-hidden mb-8 shadow-sm">
            <div
              className="relative bg-cover bg-center py-12 px-4 sm:px-8 lg:px-12 text-center text-white min-h-[380px] flex flex-col justify-center items-center"
              style="background-image: linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.88)), url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80')"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider text-white/90 mb-4">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>CAMPUS SUPPORT SYSTEM</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-tight mb-3">
                Helping Students Reconnect with Their Belongings
              </h1>

              <p className="text-xs sm:text-sm text-gray-200 max-w-2xl leading-relaxed mb-8">
                Lost your keys? Found a phone? Join thousands of students who use our secure campus network to return items to their rightful owners quickly and efficiently.
              </p>

              <!-- Search Bar & Button in Hero -->
              <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-2.5 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl">
                <div className="relative flex-1 w-full">
                  <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Search for your lost item (e.g. 'blue wallet')"
                    className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 font-medium"
                  />
                </div>
                <button
                  @click="isReportModalOpen = true"
                  className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <span>Report New Item</span>
                </button>
              </div>
            </div>

            <!-- Stats Bar -->
            <div className="bg-gray-100/70 p-4 sm:p-6 border-t border-gray-200/60">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 border border-gray-200 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">CURRENT LOST ITEMS</p>
                    <p className="text-xl sm:text-2xl font-black text-gray-900">{{ stats.currentLost.toLocaleString() }}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-blue-200/80 shadow-xs flex items-center gap-4 border-l-4 border-l-blue-600">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">RECENT FOUND ITEMS</p>
                    <p className="text-xl sm:text-2xl font-black text-gray-900">{{ stats.recentFound.toLocaleString() }}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-xs flex items-center gap-4 border-l-4 border-l-emerald-500">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">ITEMS RECONNECTED</p>
                    <p className="text-xl sm:text-2xl font-black text-gray-900">{{ stats.reconnected.toLocaleString() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Browse by Category -->
          <section className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Browse by Category</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Find your items faster by searching through dedicated university classifications.
                </p>
              </div>
              <button
                @click="isCustomizeOpen = true"
                className="self-start sm:self-auto text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
              >
                <span>Customize Dashboard</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                </svg>
              </button>
            </div>

            <!-- Categories Grid -->
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="toggleCategory(cat.name)"
                :className="`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 transition-all relative group ${
                  selectedCategory === cat.name
                    ? 'bg-blue-50/80 border-blue-500 text-blue-700 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-gray-200/80 hover:border-gray-300 text-gray-700 hover:bg-gray-50/60'
                }`"
              >
                <div
                  :className="`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    selectedCategory === cat.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50/80 text-blue-600 group-hover:bg-blue-100/70'
                  }`"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>

                <span className="text-[11px] font-bold tracking-wider text-gray-800 uppercase">
                  {{ cat.name }}
                </span>

                <span v-if="selectedCategory === cat.name" className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </span>
              </button>
            </div>
          </section>

          <!-- Latest Lost Items -->
          <section className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Latest Lost Items
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Newly reported items missing across campus grounds and buildings.
                </p>
              </div>

              <button
                @click="searchQuery = ''; selectedCategory = null"
                className="self-start sm:self-auto px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors border border-gray-200/60"
              >
                <span>View All Lost Reports</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </button>
            </div>

            <div v-if="lostItems.length === 0" className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs text-gray-500 font-medium">No lost items match your search filter.</p>
            </div>

            <div v-else className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="item in lostItems"
                :key="item.id"
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img :src="item.imageUrl" :alt="item.title" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white bg-slate-700/90 backdrop-blur-xs">
                    LOST
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{{ item.category }}</span>
                    <h3 className="text-sm font-bold text-gray-900 mt-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {{ item.title }}
                    </h3>
                    <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5 line-clamp-1">
                        <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        <span className="truncate">{{ item.location }}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>{{ item.date }}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button
                      @click="openItemModal(item)"
                      className="w-full py-2 px-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all border border-gray-200/60"
                    >
                      <span>View Details</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Recently Found Section -->
          <section className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Recently Found
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Items picked up by faculty and students, currently held at security checkpoints.
                </p>
              </div>

              <button
                @click="searchQuery = ''; selectedCategory = null"
                className="self-start sm:self-auto px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100/80 rounded-xl text-xs font-semibold text-blue-700 flex items-center gap-1.5 transition-colors border border-blue-200/60"
              >
                <span>Browse All Found Items</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </button>
            </div>

            <div v-if="foundItems.length === 0" className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs text-gray-500 font-medium">No found items match your search filter.</p>
            </div>

            <div v-else className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="item in foundItems"
                :key="item.id"
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img :src="item.imageUrl" :alt="item.title" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white bg-blue-600">
                    FOUND
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{{ item.category }}</span>
                    <h3 className="text-sm font-bold text-gray-900 mt-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {{ item.title }}
                    </h3>
                    <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5 line-clamp-1">
                        <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        <span className="truncate">{{ item.location }}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>{{ item.date }}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button
                      @click="openItemModal(item)"
                      className="w-full py-2 px-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all border border-gray-200/60"
                    >
                      <span>View Details</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- TAB 2: MY ITEMS -->
        <div v-if="activeTab === 'my-items'" className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-black text-gray-900">My Reported Items</h1>
              <p className="text-xs text-gray-500">Manage lost or found items submitted by Alex Rivera.</p>
            </div>
            <button
              @click="isReportModalOpen = true"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <span>+ Report New Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="item in items.filter(i => i.reporterName === 'Alex Rivera' || i.id.startsWith('reported-'))"
              :key="item.id"
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs relative"
            >
              <div className="flex gap-3">
                <img :src="item.imageUrl" :alt="item.title" className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase">{{ item.type }} • {{ item.category }}</span>
                  <h3 className="text-xs font-bold text-gray-900 truncate">{{ item.title }}</h3>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">{{ item.location }}</p>
                  <span className="mt-1 inline-block px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-[10px] font-semibold">
                    Status: {{ item.status }}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <button @click="openItemModal(item)" className="text-xs font-semibold text-blue-600 hover:underline">
                  View Details
                </button>
                <button @click="deleteMyItem(item.id)" className="text-xs text-rose-500 hover:text-rose-700 p-1 rounded">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: SETTINGS -->
        <div v-if="activeTab === 'settings'" className="max-w-2xl bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Campus Account Settings</h1>
            <p className="text-xs text-gray-500">Configure notification preferences and primary campus hub.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase">Student Profile</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block">Name</span>
                  <span className="font-semibold text-gray-900">Alex Rivera</span>
                </div>
                <div>
                  <span className="text-gray-400 block">University Email</span>
                  <span className="font-semibold text-gray-900">alex.r@university.edu</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-900">Instant Email Notifications</p>
                <p className="text-[11px] text-gray-500">Get notified immediately when an item matching your lost report is found.</p>
              </div>
              <input type="checkbox" checked className="w-4 h-4 text-blue-600 rounded" />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer className="mt-16 border-t border-gray-200/80 bg-white/60 pt-12 pb-8 text-gray-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gray-200/80">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <span className="text-base font-bold text-gray-900 tracking-tight">Campus Finders</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  The official University Lost & Found digital companion. Dedicated to reconnecting our academic community one item at a time.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">QUICK LINKS</h4>
                <ul className="space-y-2 text-xs">
                  <li><button @click="isReportModalOpen = true" className="hover:text-blue-600">Report an Item</button></li>
                  <li><a href="#browse" className="hover:text-blue-600">Search Database</a></li>
                  <li><a href="#privacy" className="hover:text-blue-600">Privacy Policy</a></li>
                  <li><a href="#terms" className="hover:text-blue-600">Terms of Use</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">SECURITY POSTS</h4>
                <ul className="space-y-2 text-xs text-gray-500">
                  <li>Main Security (24/7)</li>
                  <li>Library Information Desk</li>
                  <li>Student Union Office</li>
                  <li>Gym Reception</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">HELP & SUPPORT</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">Found something urgent like a wallet or phone? Call our hotline.</p>
                <button
                  @click="isContactSecurityOpen = true"
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-bold transition-all"
                >
                  Contact Security Support
                </button>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
              <p>© 2026 University Campus Finders. All rights reserved.</p>
              <div className="flex items-center gap-4 text-[11px]">
                <a href="#accessibility" className="hover:text-gray-600">Accessibility Statement</a>
                <span>•</span>
                <a href="#cookies" className="hover:text-gray-600">Cookie Policy</a>
                <span>•</span>
                <a href="#handbook" className="hover:text-gray-600">Student Handbook</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>

    <!-- ITEM DETAIL MODAL -->
    <div v-if="selectedItemDetail" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="relative h-64 w-full bg-gray-900">
          <img :src="selectedItemDetail.imageUrl" :alt="selectedItemDetail.title" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <button @click="selectedItemDetail = null" className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center">
            ✕
          </button>

          <div className="absolute top-4 left-4 flex gap-2">
            <span :className="`px-3 py-1 rounded-full text-xs font-black uppercase text-white ${selectedItemDetail.type === 'LOST' ? 'bg-slate-700' : 'bg-blue-600'}`">
              {{ selectedItemDetail.type }} ITEM
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/20 text-white backdrop-blur-md">
              {{ selectedItemDetail.category }}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h2 className="text-2xl font-black tracking-tight">{{ selectedItemDetail.title }}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
              <p className="text-xs font-semibold text-gray-800">{{ selectedItemDetail.location }}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Report Date</p>
              <p className="text-xs font-semibold text-gray-800">{{ selectedItemDetail.date }}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-gray-700 bg-white p-3 rounded-xl border border-gray-100">
              {{ selectedItemDetail.description || 'No additional details provided.' }}
            </p>
          </div>

          <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100">
            <p className="font-bold text-xs text-blue-900">Campus Security Station</p>
            <p className="text-xs text-blue-700 mt-0.5">Held at: {{ selectedItemDetail.securityPost || 'Main Security Desk (24/7)' }}</p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div v-if="claimSent" className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl">
              <p className="text-xs font-bold">Inquiry Sent!</p>
              <p className="text-xs mt-0.5">Campus security and the reporter have been notified.</p>
            </div>
            <form v-else @submit.prevent="handleClaim" className="space-y-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase">Submit Claim Inquiry</h3>
              <textarea
                required
                rows="3"
                v-model="claimMessage"
                placeholder="Describe distinguishing marks or proof of ownership..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <div className="flex justify-end">
                <button type="submit" :disabled="isSubmittingClaim" className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md">
                  {{ isSubmittingClaim ? 'Sending...' : 'Submit Claim Request' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- REPORT MODAL -->
    <div v-if="isReportModalOpen" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Report an Item</h2>
            <p className="text-xs text-gray-500">Log a lost or found item into the campus network.</p>
          </div>
          <button @click="isReportModalOpen = false" className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form @submit.prevent="handleAddReport" className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Report Type</label>
            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                @click="reportType = 'LOST'"
                :className="`py-2 rounded-lg text-xs font-bold ${reportType === 'LOST' ? 'bg-slate-800 text-white' : 'text-gray-600'}`"
              >
                LOST ITEM
              </button>
              <button
                type="button"
                @click="reportType = 'FOUND'"
                :className="`py-2 rounded-lg text-xs font-bold ${reportType === 'FOUND' ? 'bg-blue-600 text-white' : 'text-gray-600'}`"
              >
                FOUND ITEM
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Item Title</label>
            <input
              type="text"
              required
              v-model="reportTitle"
              placeholder="e.g., Sony Noise Cancelling Headphones"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
              <select v-model="reportCategory" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
              <input
                type="text"
                required
                v-model="reportLocation"
                placeholder="e.g., Student Union Level 2"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
            <textarea
              rows="3"
              v-model="reportDescription"
              placeholder="Details, color, stickers..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Select Image</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                v-for="(img, idx) in PRESET_IMAGES"
                :key="idx"
                type="button"
                @click="reportImageUrl = img"
                :className="`h-16 rounded-xl overflow-hidden border-2 ${reportImageUrl === img ? 'border-blue-600' : 'border-gray-200'}`"
              >
                <img :src="img" className="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
            <button type="button" @click="isReportModalOpen = false" className="px-4 py-2 text-xs font-semibold text-gray-600">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md">Post Report</button>
          </div>
        </form>
      </div>
    </div>

    <!-- CONTACT SECURITY MODAL -->
    <div v-if="isContactSecurityOpen" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Campus Security Posts</h2>
          <button @click="isContactSecurityOpen = false" className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-900">Urgent Lost Item Hotline</p>
            <p className="text-[11px] text-amber-700">Passports, IDs, or laptops?</p>
          </div>
          <a href="tel:5550192831" className="px-3.5 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl">Call 24/7</a>
        </div>

        <div className="mt-4 space-y-3">
          <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-200">
            <p className="text-xs font-bold text-gray-900">Main Campus Security Desk (24/7)</p>
            <p className="text-xs text-gray-600">Administrative Building, Room 101 • (555) 019-2831</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-xs font-bold text-gray-900">Library Information Desk</p>
            <p className="text-xs text-gray-600">Central Library, Ground Floor • (555) 019-2832</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button @click="isContactSecurityOpen = false" className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl">Close</button>
        </div>
      </div>
    </div>

    <!-- CUSTOMIZE MODAL -->
    <div v-if="isCustomizeOpen" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Customize Dashboard</h2>
          <button @click="isCustomizeOpen = false" className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="mt-5 space-y-5">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-900">Show Summary Counter Cards</p>
              <p className="text-[11px] text-gray-500">Display lost, found & reconnected metrics banner.</p>
            </div>
            <button
              @click="showStats = !showStats"
              :className="`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${showStats ? 'bg-blue-600' : 'bg-gray-300'}`"
            >
              <div :className="`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${showStats ? 'translate-x-6' : 'translate-x-0'}`" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Items per Section</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                v-for="num in [4, 8, 12]"
                :key="num"
                @click="itemsPerPage = num"
                :className="`py-2 rounded-xl text-xs font-bold border ${itemsPerPage === num ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-gray-200'}`"
              >
                {{ num }} Items
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button @click="isCustomizeOpen = false" className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

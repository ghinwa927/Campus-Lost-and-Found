import type { CampusItem, CategoryItem, ItemType, ItemStatus } from '~/types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'ALL', name: 'All Categories', icon: 'Grid' },
  { id: 'ELECTRONICS', name: 'ELECTRONICS', icon: 'Laptop' },
  { id: 'BAGS', name: 'BAGS', icon: 'ShoppingBag' },
  { id: 'PERSONAL ITEMS', name: 'PERSONAL ITEMS', icon: 'User' },
  { id: 'BOOKS', name: 'BOOKS', icon: 'BookOpen' },
  { id: 'KEYS', name: 'KEYS', icon: 'Key' },
  { id: 'STUDENT ID', name: 'STUDENT ID', icon: 'CreditCard' },
  { id: 'WATER BOTTLE', name: 'WATER BOTTLE', icon: 'Droplet' },
  { id: 'PHONE', name: 'PHONE', icon: 'Smartphone' },
  { id: 'CLOTHING', name: 'CLOTHING', icon: 'Shirt' },
  { id: 'OTHER', name: 'OTHER', icon: 'MoreHorizontal' },
];

export const INITIAL_ITEMS: CampusItem[] = [
  {
    id: 'lost-1',
    title: 'Silver MacBook Pro 14"',
    type: 'LOST',
    category: 'ELECTRONICS',
    building: 'Central Library',
    faculty: 'General Studies',
    location: 'Central Library, Level 3, Section B',
    date: 'Oct 28, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    description: "Left on a study desk in Level 3, Section B. Has a small 'NASA' sticker on the top right",
    reporterName: 'Alex Rivera',
    reporterPhone: '+1 (555) 234-5678',
    reporterEmail: 'alex.r@university.edu',
    reporterContact: 'alex.r@university.edu',
    status: 'ACTIVE',
    securityPost: 'Main Library Information Desk'
  },
  {
    id: 'lost-2',
    title: 'Navy Blue North Face',
    type: 'LOST',
    category: 'BAGS',
    building: 'Student Union',
    faculty: 'Social Sciences',
    location: 'Student Union Cafeteria',
    date: 'Oct 27, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    description: 'Contains several notebooks and a black pencil case. Last seen near the cafeteria',
    reporterName: 'Jordan Lee',
    reporterPhone: '+1 (555) 345-6789',
    reporterEmail: 'jordan.l@university.edu',
    reporterContact: 'jordan.l@university.edu',
    status: 'ACTIVE',
    securityPost: 'Student Union Security Post'
  },
  {
    id: 'lost-3',
    title: 'Stainless Steel Hydroflask',
    type: 'LOST',
    category: 'PERSONAL ITEMS',
    building: 'Engineering Block A',
    faculty: 'Engineering',
    location: 'Engineering Block A, Room 102',
    date: 'Oct 27, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    description: "32oz silver bottle with a black lid and a 'University Cycling Club' decal.",
    reporterName: 'Marcus Vance',
    reporterPhone: '+1 (555) 456-7890',
    reporterEmail: 'm.vance@university.edu',
    reporterContact: 'm.vance@university.edu',
    status: 'ACTIVE',
    securityPost: 'Engineering Quad Office'
  },
  {
    id: 'lost-4',
    title: 'Sony WH-1000XM5',
    type: 'LOST',
    category: 'ELECTRONICS',
    building: 'Arts & Design Center',
    faculty: 'Fine Arts',
    location: 'Arts & Design Center, Media Lab',
    date: 'Oct 26, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Black over-ear headphones in a grey protective case. Left in the digital media lab.',
    reporterName: 'Samantha Green',
    reporterPhone: '+1 (555) 567-8901',
    reporterEmail: 'sgreen@university.edu',
    reporterContact: 'sgreen@university.edu',
    status: 'ACTIVE',
    securityPost: 'Fine Arts Security Desk'
  },
  {
    id: 'lost-5',
    title: 'Principles of Economics',
    type: 'LOST',
    category: 'BOOKS',
    building: 'Business School',
    faculty: 'Economics',
    location: 'Business School, Lecture Hall 2',
    date: 'Oct 25, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: "12th Edition textbook, slightly worn corners. Name 'Sarah J.' written on the inside cover.",
    reporterName: 'Sarah Jenkins',
    reporterPhone: '+1 (555) 678-9012',
    reporterEmail: 's.jenkins@university.edu',
    reporterContact: 's.jenkins@university.edu',
    status: 'ACTIVE',
    securityPost: 'Business School Admin Desk'
  },
  {
    id: 'lost-6',
    title: 'Dorm Keys with Keychain',
    type: 'LOST',
    category: 'KEYS',
    building: 'Main Gym',
    faculty: 'Sports Science',
    location: 'Main Gym Locker Room',
    date: 'Oct 25, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    description: "Three silver keys on a blue braided keychain with a small 'I Love NY' souvenir tag.",
    reporterName: 'David Kim',
    reporterPhone: '+1 (555) 789-0123',
    reporterEmail: 'd.kim@university.edu',
    reporterContact: 'd.kim@university.edu',
    status: 'ACTIVE',
    securityPost: 'Gym Reception Desk'
  },
  {
    id: 'lost-7',
    title: 'iPhone 15 Pro Titanium',
    type: 'LOST',
    category: 'PHONE',
    building: 'Engineering Block A',
    faculty: 'Engineering',
    location: 'Engineering Building, Room 402',
    date: 'Oct 24, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    description: 'Natural Titanium iPhone 15 Pro with a clear case and university sticker on the back.',
    reporterName: 'Marcus Vance',
    reporterPhone: '+1 (555) 456-7890',
    reporterEmail: 'm.vance@university.edu',
    reporterContact: 'm.vance@university.edu',
    status: 'ACTIVE',
    securityPost: 'Engineering Quad Office'
  },
  {
    id: 'lost-8',
    title: 'TI-84 Plus Graphing Calculator',
    type: 'LOST',
    category: 'ELECTRONICS',
    building: 'Science Quad',
    faculty: 'General Studies',
    location: 'Science Quad Math Annex',
    date: 'Oct 23, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    description: 'Black TI-84 Plus CE graphing calculator with "STAT 101" written on cover.',
    reporterName: 'Prof. Miller',
    reporterPhone: '+1 (555) 890-1234',
    reporterEmail: 'math.dept@university.edu',
    reporterContact: 'math.dept@university.edu',
    status: 'ACTIVE',
    securityPost: 'Math Dept Admin Office'
  },
  {
    id: 'lost-9',
    title: 'Student ID Card - Red Lanyard',
    type: 'LOST',
    category: 'STUDENT ID',
    building: 'Central Library',
    faculty: 'Social Sciences',
    location: 'Library Cafe Counter',
    date: 'Oct 22, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    description: 'Student ID card on a red University Volunteer lanyard.',
    reporterName: 'Emily Watson',
    reporterPhone: '+1 (555) 901-2345',
    reporterEmail: 'e.watson@university.edu',
    reporterContact: 'e.watson@university.edu',
    status: 'ACTIVE',
    securityPost: 'Main Library Information Desk'
  }
];

export const INITIAL_BUILDINGS = [
  'Select Building',
  'Central Library',
  'Student Union',
  'Engineering Block A',
  'Arts & Design Center',
  'Business School',
  'Main Gym',
  'Science Quad'
];

export const INITIAL_FACULTIES = [
  'Select Faculty',
  'General Studies',
  'Social Sciences',
  'Engineering',
  'Fine Arts',
  'Economics',
  'Sports Science'
];

export const INITIAL_TIMEFRAMES = [
  'Any Time',
  'Today',
  'Past 3 Days',
  'Past Week',
  'Past Month'
];

export const useCampusItems = () => {
  const items = useState<CampusItem[]>('campus-items', () => INITIAL_ITEMS);
  const selectedItem = useState<CampusItem | null>('selected-item', () => null);
  const claimingItem = useState<CampusItem | null>('claiming-item', () => null);

  const addItem = (newItem: CampusItem) => {
    items.value = [newItem, ...items.value];
  };

  const updateStatus = (itemId: string, newStatus: ItemStatus) => {
    items.value = items.value.map(item => {
      if (item.id === itemId) {
        return { ...item, status: newStatus };
      }
      return item;
    });

    if (selectedItem.value && selectedItem.value.id === itemId) {
      selectedItem.value = { ...selectedItem.value, status: newStatus };
    }
  };

  const deleteItem = (itemId: string) => {
    items.value = items.value.filter(item => item.id !== itemId);
    if (selectedItem.value?.id === itemId) {
      selectedItem.value = null;
    }
  };

  const getItemById = (itemId: string) => {
    return items.value.find(item => item.id === itemId);
  };

  return {
    items,
    selectedItem,
    claimingItem,
    addItem,
    updateStatus,
    deleteItem,
    getItemById,
  };
};
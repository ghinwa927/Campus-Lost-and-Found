import { CampusItem, CategoryItem } from '../types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat-all', name: 'All Categories', icon: 'Grid' },
  { id: 'cat-elec', name: 'ELECTRONICS', icon: 'Laptop' },
  { id: 'cat-bags', name: 'BAGS', icon: 'ShoppingBag' },
  { id: 'cat-items', name: 'PERSONAL ITEMS', icon: 'Briefcase' },
  { id: 'cat-books', name: 'BOOKS', icon: 'Book' },
  { id: 'cat-keys', name: 'KEYS', icon: 'Key' },
  { id: 'cat-phone', name: 'PHONE', icon: 'Smartphone' },
  { id: 'cat-id', name: 'STUDENT ID', icon: 'CreditCard' },
];

export const INITIAL_BUILDINGS = [
  'Select Building',
  'Central Library',
  'Engineering Block A',
  'Student Union Hall',
  'Science Complex B',
  'Business School',
  'Sports Center',
  'Main Cafeteria'
];

export const INITIAL_FACULTIES = [
  'Select Faculty',
  'Faculty of Engineering',
  'Faculty of Computer Science',
  'Faculty of Business',
  'Faculty of Medicine',
  'Faculty of Arts & Humanities',
  'General Studies'
];

export const INITIAL_TIMEFRAMES = [
  'Any Time',
  'Today',
  'Past 3 Days',
  'Past Week',
  'Past Month'
];

export const INITIAL_ITEMS: CampusItem[] = [
  {
    id: 'lost-1',
    title: 'MacBook Pro 14" M2 Silver',
    type: 'LOST',
    category: 'ELECTRONICS',
    building: 'Central Library',
    faculty: 'Faculty of Computer Science',
    location: '3rd Floor Quiet Study Zone, Table 12',
    date: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    description: 'Silver 14-inch MacBook Pro inside a dark gray felt sleeve. Has sticker of GitHub octocat on the back.',
    reporterName: 'Alex Rivera',
    reporterPhone: '+1 (555) 234-5678',
    reporterEmail: 'alex.r@university.edu',
    status: 'ACTIVE',
    securityPost: 'Central Library Main Security Desk'
  },
  {
    id: 'found-1',
    title: 'Black Herschel Backpack',
    type: 'FOUND',
    category: 'BAGS',
    building: 'Engineering Block A',
    faculty: 'Faculty of Engineering',
    location: 'Ground Floor Lecture Hall 101',
    date: '4 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    description: 'Black canvas backpack containing notebooks and a blue water bottle. Handed to security guard on duty.',
    reporterName: 'Officer David Vance',
    reporterPhone: '+1 (555) 987-6543',
    reporterEmail: 'd.vance@campus-security.edu',
    status: 'ACTIVE',
    securityPost: 'Engineering Block Security Guard Desk'
  },
  {
    id: 'found-2',
    title: 'Hydro Flask Metal Bottle 32oz',
    type: 'FOUND',
    category: 'PERSONAL ITEMS',
    building: 'Student Union Hall',
    faculty: 'General Studies',
    location: 'Near Food Court Counter #3',
    date: 'Yesterday',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    description: 'Pacific blue insulated water bottle with national parks stickers.',
    reporterName: 'Sarah Chen',
    reporterPhone: '+1 (555) 345-6789',
    reporterEmail: 'schen@student.edu',
    status: 'ACTIVE',
    securityPost: 'Student Union Information Desk'
  },
  {
    id: 'lost-2',
    title: 'Sony WH-1000XM4 Headphones',
    type: 'LOST',
    category: 'ELECTRONICS',
    building: 'Science Complex B',
    faculty: 'Faculty of Science',
    location: 'Physics Lab 204',
    date: '1 day ago',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Black noise-canceling headphones inside a black zipper case. Left under lab bench.',
    reporterName: 'Marcus Brodie',
    reporterPhone: '+1 (555) 456-7890',
    reporterEmail: 'm.brodie@university.edu',
    status: 'ACTIVE',
    securityPost: 'Science Complex Admin Desk'
  },
  {
    id: 'lost-3',
    title: 'Calculus III Organic Chemistry Textbook',
    type: 'LOST',
    category: 'BOOKS',
    building: 'Central Library',
    faculty: 'Faculty of Science',
    location: '2nd Floor Reference Section',
    date: '2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: 'Hardcover textbook with yellow highlighter notes on chapter 4.',
    reporterName: 'Emily Watson',
    reporterPhone: '+1 (555) 567-8901',
    reporterEmail: 'ewatson@student.edu',
    status: 'ACTIVE',
    securityPost: 'Central Library Security Counter'
  },
  {
    id: 'found-3',
    title: 'Car & Keycard Keychain',
    type: 'FOUND',
    category: 'KEYS',
    building: 'Sports Center',
    faculty: 'General Studies',
    location: 'Gym Basketball Court Locker Room B',
    date: '3 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    description: 'Toyota key fob attached to leather lanyard and dormitory access pass #0492.',
    reporterName: 'Coach Jordan',
    reporterPhone: '+1 (555) 678-9012',
    reporterEmail: 'jjordan@sports.edu',
    status: 'ACTIVE',
    securityPost: 'Sports Center Reception Desk'
  }
];
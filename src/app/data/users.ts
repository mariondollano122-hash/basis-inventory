import { Department } from '../types/inventory';

export type UserRole = 'Barangay Captain' | 'Secretary' | 'Committee Head';

export interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  department?: Department; // Only for Committee Heads
  email: string;
  contactNumber: string;
  createdAt: string;
  lastLogin?: string;
}

// Predefined 10 authorized users for B.A.S.I.S. system
export const PREDEFINED_USERS: User[] = [
  // 1. Barangay Captain - View-only access to all committees
  {
    id: 'user_001',
    username: 'captain',
    password: 'captain2024', // In production, this should be hashed
    fullName: 'Juan Dela Cruz',
    role: 'Barangay Captain',
    email: 'captain@balintawak.gov.ph',
    contactNumber: '+63 912 345 6789',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  
  // 2. Secretary - Full access to all committees + exclusive print/export rights
  {
    id: 'user_002',
    username: 'secretary',
    password: 'secretary2024',
    fullName: 'Maria Santos',
    role: 'Secretary',
    email: 'secretary@balintawak.gov.ph',
    contactNumber: '+63 912 345 6790',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  
  // 3. Health Committee Head
  {
    id: 'user_003',
    username: 'health_head',
    password: 'health2024',
    fullName: 'Dr. Rosa Reyes',
    role: 'Committee Head',
    department: 'Health',
    email: 'health@balintawak.gov.ph',
    contactNumber: '+63 912 345 6791',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  
  // 4. Education Committee Head
  {
    id: 'user_004',
    username: 'education_head',
    password: 'education2024',
    fullName: 'Prof. Roberto Garcia',
    role: 'Committee Head',
    department: 'Education',
    email: 'education@balintawak.gov.ph',
    contactNumber: '+63 912 345 6792',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  
  // 5. Justice Committee Head
  {
    id: 'user_005',
    username: 'justice_head',
    password: 'justice2024',
    fullName: 'Atty. Linda Mendoza',
    role: 'Committee Head',
    department: 'Justice',
    email: 'justice@balintawak.gov.ph',
    contactNumber: '+63 912 345 6793',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  
  // 6. Appropriation Committee Head
  {
    id: 'user_006',
    username: 'appropriation_head',
    password: 'appropriation2024',
    fullName: 'Carlos Ramos',
    role: 'Committee Head',
    department: 'Appropriation',
    email: 'appropriation@balintawak.gov.ph',
    contactNumber: '+63 912 345 6794',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  
  // 7. Peace and Order Committee Head
  {
    id: 'user_007',
    username: 'peace_head',
    password: 'peace2024',
    fullName: 'Benjamin Torres',
    role: 'Committee Head',
    department: 'Peace and Order',
    email: 'peace@balintawak.gov.ph',
    contactNumber: '+63 912 345 6795',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  
  // 8. Sports Committee Head
  {
    id: 'user_008',
    username: 'sports_head',
    password: 'sports2024',
    fullName: 'Manuel Cruz',
    role: 'Committee Head',
    department: 'Sports',
    email: 'sports@balintawak.gov.ph',
    contactNumber: '+63 912 345 6796',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  
  // 9. Agriculture Committee Head
  {
    id: 'user_009',
    username: 'agriculture_head',
    password: 'agriculture2024',
    fullName: 'Elena Villanueva',
    role: 'Committee Head',
    department: 'Agriculture',
    email: 'agriculture@balintawak.gov.ph',
    contactNumber: '+63 912 345 6797',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  
  // 10. Infrastructure Committee Head
  {
    id: 'user_010',
    username: 'infrastructure_head',
    password: 'infrastructure2024',
    fullName: 'Eng. Pedro Aquino',
    role: 'Committee Head',
    department: 'Infrastructure',
    email: 'infrastructure@balintawak.gov.ph',
    contactNumber: '+63 912 345 6798',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

// Initialize users in localStorage
export function initializeUsers(): User[] {
  const savedUsers = localStorage.getItem('basis_users');
  
  if (!savedUsers) {
    localStorage.setItem('basis_users', JSON.stringify(PREDEFINED_USERS));
    return PREDEFINED_USERS;
  }
  
  return JSON.parse(savedUsers);
}

// Get all users
export function getAllUsers(): User[] {
  const users = localStorage.getItem('basis_users');
  return users ? JSON.parse(users) : PREDEFINED_USERS;
}

// Update a user
export function updateUser(userId: string, updates: Partial<User>): User[] {
  const users = getAllUsers();
  const updatedUsers = users.map(user => 
    user.id === userId ? { ...user, ...updates } : user
  );
  localStorage.setItem('basis_users', JSON.stringify(updatedUsers));
  return updatedUsers;
}

// Export users to JSON (can be opened in Excel)
export function exportUsersToJSON(): string {
  const users = getAllUsers();
  return JSON.stringify(users, null, 2);
}

// Import users from JSON
export function importUsersFromJSON(jsonString: string): boolean {
  try {
    const users = JSON.parse(jsonString);
    
    // Validate the data structure
    if (!Array.isArray(users) || users.length !== 10) {
      throw new Error('Invalid user data: Must contain exactly 10 users');
    }
    
    // Validate each user has required fields
    users.forEach((user, index) => {
      if (!user.id || !user.username || !user.password || !user.fullName || !user.role) {
        throw new Error(`Invalid user at index ${index}: Missing required fields`);
      }
    });
    
    localStorage.setItem('basis_users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Failed to import users:', error);
    return false;
  }
}

// Export users to CSV format (Excel compatible)
export function exportUsersToCSV(): string {
  const users = getAllUsers();
  
  // CSV Headers
  const headers = [
    'ID',
    'Username',
    'Password',
    'Full Name',
    'Role',
    'Department',
    'Email',
    'Contact Number',
    'Created At',
    'Last Login'
  ];
  
  // CSV Rows
  const rows = users.map(user => [
    user.id,
    user.username,
    user.password,
    user.fullName,
    user.role,
    user.department || 'N/A',
    user.email,
    user.contactNumber,
    user.createdAt,
    user.lastLogin || 'Never'
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
}

// Reset users to default predefined users
export function resetUsersToDefault(): User[] {
  localStorage.setItem('basis_users', JSON.stringify(PREDEFINED_USERS));
  return PREDEFINED_USERS;
}

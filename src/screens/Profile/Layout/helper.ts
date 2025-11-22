// helper.ts
export const getInitials = (name: string) => {
  if (!name) return 'NA';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const tabs = [
  {
    key: 'company-info',
    title: 'Company Info',
    icon: 'office-building' as const,
    count: 0,
  },
  {
    key: 'employees',
    title: 'Employees',
    icon: 'account-group' as const,
    count: 4,
  },
  {
    key: 'vehicles',
    title: 'Vehicles',
    icon: 'truck' as const,
    count: 2,
  },
  {
    key: 'documents',
    title: 'Documents',
    icon: 'file-document' as const,
    count: 1,
  },
];

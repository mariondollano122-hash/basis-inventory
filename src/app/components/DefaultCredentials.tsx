import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Shield, User, Users } from 'lucide-react';

export function DefaultCredentials() {
  const users = [
    {
      role: 'Barangay Captain',
      icon: Shield,
      color: 'text-purple-600 bg-purple-100',
      username: 'captain',
      password: 'captain2024',
      access: 'View-only (All Committees)'
    },
    {
      role: 'Secretary',
      icon: User,
      color: 'text-blue-600 bg-blue-100',
      username: 'secretary',
      password: 'secretary2024',
      access: 'Full Access + Print/Export'
    },
    {
      role: 'Health Committee',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-100',
      username: 'health_head',
      password: 'health2024',
      access: 'Health Committee Only'
    },
    {
      role: 'Education Committee',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-100',
      username: 'education_head',
      password: 'education2024',
      access: 'Education Committee Only'
    },
    {
      role: 'Justice Committee',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-100',
      username: 'justice_head',
      password: 'justice2024',
      access: 'Justice Committee Only'
    },
    {
      role: 'Appropriation Committee',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-100',
      username: 'appropriation_head',
      password: 'appropriation2024',
      access: 'Appropriation Committee Only'
    },
    {
      role: 'Peace & Order Committee',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-100',
      username: 'peace_head',
      password: 'peace2024',
      access: 'Peace & Order Committee Only'
    },
    {
      role: 'Sports Committee',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-100',
      username: 'sports_head',
      password: 'sports2024',
      access: 'Sports Committee Only'
    },
    {
      role: 'Agriculture Committee',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-100',
      username: 'agriculture_head',
      password: 'agriculture2024',
      access: 'Agriculture Committee Only'
    },
    {
      role: 'Infrastructure Committee',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-100',
      username: 'infrastructure_head',
      password: 'infrastructure2024',
      access: 'Infrastructure Committee Only'
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Default System Credentials</CardTitle>
        <p className="text-sm text-slate-600 text-center">
          Use these credentials to access the B.A.S.I.S. system
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <div className={`p-2 rounded-lg ${user.color}`}>
                <user.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 mb-1">{user.role}</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-slate-600">
                    <span className="font-medium">Username:</span>{' '}
                    <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">
                      {user.username}
                    </code>
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium">Password:</span>{' '}
                    <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">
                      {user.password}
                    </code>
                  </p>
                  <p className="text-xs text-slate-500">{user.access}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


import { Reminder } from '@/pages/Index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar,
  User,
  Bell,
  File,
  Clock,
  Mail
} from 'lucide-react';

interface CategoryGridProps {
  reminders: Reminder[];
}

const categories = [
  {
    id: 'medication',
    name: 'Medications',
    icon: Calendar,
    gradient: 'gradient-medication',
    description: 'Pills, vitamins & treatments'
  },
  {
    id: 'bills',
    name: 'Bills',
    icon: File,
    gradient: 'gradient-bills',
    description: 'Utilities, rent & payments'
  },
  {
    id: 'tasks',
    name: 'Tasks',
    icon: Bell,
    gradient: 'gradient-tasks',
    description: 'To-dos & important tasks'
  },
  {
    id: 'water',
    name: 'Water Intake',
    icon: Clock,
    gradient: 'gradient-water',
    description: 'Stay hydrated throughout day'
  },
  {
    id: 'meetings',
    name: 'Meetings',
    icon: User,
    gradient: 'gradient-meetings',
    description: 'Appointments & calls'
  },
  {
    id: 'birthdays',
    name: 'Birthdays',
    icon: Calendar,
    gradient: 'gradient-birthdays',
    description: 'Special dates & celebrations'
  },
  {
    id: 'custom',
    name: 'Custom',
    icon: Mail,
    gradient: 'gradient-custom',
    description: 'Your personal reminders'
  }
];

export function CategoryGrid({ reminders }: CategoryGridProps) {
  const getCategoryCount = (categoryId: string) => {
    return reminders.filter(reminder => reminder.category === categoryId).length;
  };

  const getActiveCount = (categoryId: string) => {
    return reminders.filter(reminder => 
      reminder.category === categoryId && !reminder.completed
    ).length;
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Reminder Categories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          const totalCount = getCategoryCount(category.id);
          const activeCount = getActiveCount(category.id);
          
          return (
            <Card 
              key={category.userId}
              className="card-hover bg-white/95 backdrop-blur-sm border-0 shadow-xl overflow-hidden cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className={`w-full h-24 ${category.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {category.name}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {category.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {totalCount}
                    </div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {activeCount}
                    </div>
                    <div className="text-xs text-gray-500">Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

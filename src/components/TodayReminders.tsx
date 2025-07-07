
import { Reminder } from '@/pages/Index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Calendar, Mail, Bell } from 'lucide-react';

interface TodayRemindersProps {
  reminders: Reminder[];
  onToggle: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export function TodayReminders({ reminders, onToggle, onDelete }: TodayRemindersProps) {
  console.log("reminders=>",reminders)
  const todayReminders = reminders.slice(0, 5); // Show first 5 for demo
  
  const getGradientClass = (category: string) => {
    const gradients = {
      medication: 'gradient-medication',
      bills: 'gradient-bills',
      tasks: 'gradient-tasks',
      water: 'gradient-water',
      meetings: 'gradient-meetings',
      birthdays: 'gradient-birthdays',
      custom: 'gradient-custom'
    };
    return gradients[category as keyof typeof gradients] || 'gradient-custom';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      medication: 'bg-blue-100 text-blue-800',
      bills: 'bg-red-100 text-red-800',
      tasks: 'bg-green-100 text-green-800',
      water: 'bg-cyan-100 text-cyan-800',
      meetings: 'bg-purple-100 text-purple-800',
      birthdays: 'bg-pink-100 text-pink-800',
      custom: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-8 h-8 text-white" />
        <h2 className="text-3xl font-bold text-white">Today's Reminders</h2>
        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
          {todayReminders.filter(r => !r.completed).length} active
        </Badge>
      </div>
      
      {todayReminders.length === 0 ? (
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 font-medium">No reminders for today!</p>
            <p className="text-gray-500">You're all caught up. Great job!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {todayReminders.map((reminder) => (
            <Card 
              key={reminder?.userId}
              className={`card-hover bg-white/95 backdrop-blur-sm border-0 shadow-xl ${
                reminder.completed ? 'opacity-75' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-4 h-4 ${getGradientClass(reminder.category)} rounded-full mt-1 flex-shrink-0`}></div>
                    <div className="flex-1">
                      <CardTitle className={`text-lg font-semibold ${
                        reminder.completed ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}>
                        {reminder.title}
                      </CardTitle>
                      {reminder.description && (
                        <p className={`text-sm mt-1 ${
                          reminder.completed ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {reminder.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge className={getCategoryColor(reminder.category)}>
                          {reminder.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {reminder.time}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {reminder.frequency}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {reminder.notifications.email && (
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <Mail className="w-3 h-3" />
                            </div>
                          )}
                          {reminder.notifications.push && (
                            <div className="flex items-center gap-1 text-xs text-purple-600">
                              <Bell className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => onToggle(reminder?.userId)}
                    size="sm"
                    variant={reminder.completed ? "secondary" : "default"}
                    className={`flex items-center gap-2 ${
                      reminder.completed 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {reminder.completed ? 'Completed' : 'Mark Done'}
                  </Button>
                  <Button
                    onClick={() => onDelete(reminder?.userId)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

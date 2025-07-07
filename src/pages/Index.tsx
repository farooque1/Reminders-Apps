import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryGrid } from '@/components/CategoryGrid';
import { TodayReminders } from '@/components/TodayReminders';
import { AddReminderForm } from '@/components/AddReminderForm';
import { UserProfile } from '@/components/UserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, Bell } from 'lucide-react';
import { APIRemindersList } from '@/Auth/comman';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  category: string;
  time: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  color: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // const [reminders, setReminders] = useState<Reminder[]>([
  //   {
  //     id: '1',
  //     title: 'Take Vitamin D',
  //     description: '1000 IU after breakfast',
  //     category: 'medication',
  //     time: '09:00',
  //     frequency: 'daily',
  //     completed: false,
  //     color: 'blue',
  //     notifications: {
  //       email: true,
  //       push: false
  //     }
  //   },
  //   {
  //     id: '2',
  //     title: 'Electricity Bill Due',
  //     description: 'Pay $85 online',
  //     category: 'bills',
  //     time: '10:00',
  //     frequency: 'monthly',
  //     completed: false,
  //     color: 'red',
  //     notifications: {
  //       email: true,
  //       push: true
  //     }
  //   },
  //   {
  //     id: '3',
  //     title: 'Drink Water',
  //     description: '8 oz glass',
  //     category: 'water',
  //     time: '14:00',
  //     frequency: 'daily',
  //     completed: true,
  //     color: 'cyan',
  //     notifications: {
  //       email: false,
  //       push: true
  //     }
  //   }
  // ]);

const [reminders, setReminders] = useState<Reminder[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);

  const addReminder = (reminder: Omit<Reminder, 'id' | 'completed'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      completed: false
    };
    setReminders([...reminders, newReminder]);
    setShowAddForm(false);
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const RemindersListHandler= async ()=>{
   const ListData = await APIRemindersList();
   setReminders(ListData?.data);
   console.log(ListData)
  }

  useEffect(()=>{
    RemindersListHandler()
  },[])

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight">
                Life Reminders
              </h1>
            </div>
            <UserProfile />
          </div>
          <p className="text-xl text-white/90 font-medium">
            Welcome back, {user.name}! Your personal reminder assistant for everything that matters
          </p>
        </div>

        {/* Quick Add Button */}
        <div className="text-center mb-8 animate-scale-in">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 rounded-2xl px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            size="lg"
          >
            <Plus className="w-6 h-6 mr-2" />
            Add New Reminder
          </Button>
        </div>

        {/* Add Reminder Form */}
        {showAddForm && (
          <div className="mb-8 animate-scale-in">
            <AddReminderForm 
              onAdd={addReminder}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Today's Reminders */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <TodayReminders 
            reminders={reminders}
            onToggle={toggleReminder}
            onDelete={deleteReminder}
          />
        </div>

        {/* Category Overview */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CategoryGrid reminders={reminders} />
        </div>
      </div>
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Mail, Bell, AlertTriangle } from "lucide-react";
import {
  getPushNotificationState,
  requestPushNotificationPermission,
  sendTestNotification,
} from "@/utils/pushNotifications";
import { APIAddReminder } from "@/Auth/comman";
import { savePushSubscription } from "@/utils/savePushSubscription";

const categories = [
  { id: "medication", name: "Medications", color: "blue" },
  { id: "bills", name: "Bills", color: "red" },
  { id: "tasks", name: "Tasks", color: "green" },
  { id: "water", name: "Water Intake", color: "cyan" },
  { id: "meetings", name: "Meetings", color: "purple" },
  { id: "birthdays", name: "Birthdays", color: "pink" },
  { id: "custom", name: "Custom", color: "orange" },
];

interface AddReminderFormProps {
  onAdd: (reminder: {
    title: string;
    description?: string;
    category: string;
    time: string;
    frequency: "once" | "daily" | "weekly" | "monthly";
    color: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  }) => void;
  onCancel: () => void;
}

export function AddReminderForm({ onAdd, onCancel }: AddReminderFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    time: "",
    frequency: "daily" as "once" | "daily" | "weekly" | "monthly",
    notifications: {
      email: true,
      push: false,
    },
  });

  const [pushState, setPushState] = useState(getPushNotificationState());
  const navigate = useNavigate();

  useEffect(() => {
    setPushState(getPushNotificationState());
  }, []);

  const handlePushNotificationToggle = async (checked: boolean) => {
    console.log("Push toggle clicked:", checked);
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported in your browser");
      return;
    }

    if (checked) {
      // Request permission first
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const saved = await savePushSubscription();
        if (saved) {
          setFormData((prev) => ({
            ...prev,
            notifications: { ...prev.notifications, push: true },
          }));
          sendTestNotification("Push Enabled!", "You will get reminders.");
        }
      } else {
        console.warn("Push permission denied");
        setFormData((prev) => ({
          ...prev,
          notifications: { ...prev.notifications, push: false },
        }));
      }
    } else {
      // User is disabling push notifications
      setFormData((prev) => ({
        ...prev,
        notifications: { ...prev.notifications, push: false },
      }));
    }
  };

  const getPushNotificationStatus = () => {
    if (!pushState.isSupported)
      return { text: "Not supported", color: "text-red-500" };

    switch (pushState.permission) {
      case "granted":
        return { text: "Enabled", color: "text-green-600" };
      case "denied":
        return { text: "Blocked", color: "text-red-500" };
      default:
        return { text: "Click to enable", color: "text-yellow-600" };
    }
  };

  console.log(
    "notifyVia",
    [
      formData.notifications.email && "email",
      formData.notifications.push && "push",
    ].filter(Boolean)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.time) return;

    const selectedCategory = categories.find(
      (cat) => cat.id === formData.category
    );

    const reminderPayload = {
      id: String(Date.now()), // or use a UUID if needed
      title: formData.title,
      description: formData.description,
      category: formData.category, // keeping as ID (e.g., 'bills') to match target JSON
      time: formData.time,
      reminderTime: formData.time,
      frequency: formData.frequency,
      completed: false,
      color: selectedCategory?.color || "gray",
      notifications: {
        email: formData.notifications.email,
        push: formData.notifications.push,
      },
    };

    try {
      const res = await APIAddReminder(reminderPayload);
      if (!res.ok) throw new Error("Failed to create reminder");
      onAdd(res?.data);
      navigate("/");
      onCancel();
    } catch (err) {
      console.error("Reminder create failed:", err);
    }

    setFormData({
      title: "",
      description: "",
      category: "",
      time: "",
      frequency: "daily",
      notifications: {
        email: true,
        push: false,
      },
    });
  };

  const status = getPushNotificationStatus();

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Add New Reminder
          </CardTitle>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          {/* Title & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Reminder Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Category & Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 bg-${category.color}-500 rounded-full`}
                        ></div>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(
                  value: "once" | "daily" | "weekly" | "monthly"
                ) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notification Methods */}
          <div className="space-y-3">
            <Label>Notification Methods</Label>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="email"
                  checked={formData.notifications.email}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        email: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Email
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                {/* <Checkbox
                  id="push"
                  checked={formData.notifications.push}
                   onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        push: checked as boolean,
                      },
                    })
                  }
                  // onCheckedChange={handlePushNotificationToggle}
                  // disabled={!pushState.isSupported}
                /> */}
                <Checkbox
                  id="push"
                  checked={formData.notifications.push}
                  onCheckedChange={handlePushNotificationToggle} // ✅ Use the correct function
                  disabled={!pushState.isSupported}
                />

                <Label htmlFor="push" className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-500" />
                  Push Notifications{" "}
                  <span className={`text-xs ${status.color}`}>
                    ({status.text})
                  </span>
                  {!pushState.isSupported && (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                </Label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              disabled={!formData.title || !formData.category || !formData.time}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Reminder
            </Button>
            <Button type="button" onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

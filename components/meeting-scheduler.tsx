"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, VideoIcon, MapPin, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TalentedUser } from "@/lib/stores/shortlist-store";

interface MeetingSchedulerProps {
  user: TalentedUser;
}

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

const meetingTypes = [
  { value: "video", label: "Video Call", icon: VideoIcon },
  { value: "phone", label: "Phone Call", icon: User },
  { value: "in-person", label: "In-Person", icon: MapPin },
];

export function MeetingScheduler({ user }: MeetingSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [meetingType, setMeetingType] = useState<string>("video");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setSelectedDate(undefined);
      setSelectedTime("");
      setMeetingType("video");
      setNotes("");
    }
  };

  const handleScheduleMeeting = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select both a date and time for the meeting.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the meeting request to your backend
    toast({
      title: "Meeting scheduled!",
      description: `Meeting with ${
        user.name
      } scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
    });

    setOpen(false);
    // Reset form
    setSelectedDate(undefined);
    setSelectedTime("");
    setNotes("");
  };

  const selectedMeetingType = meetingTypes.find(
    (type) => type.value === meetingType
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Meeting with {user.name}</DialogTitle>
          <DialogDescription>
            Select a date and time for your meeting with {user.name} -{" "}
            {user.professionalHeadline}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Calendar Selection */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Select Date</Label>
              <div className="mt-2 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date)}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="rounded-md border p-3 bg-card"
                  initialFocus
                  defaultMonth={new Date()}
                  numberOfMonths={1}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Time Selection */}
            <div>
              <Label className="text-base font-semibold">Select Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="mt-2 h-11">
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <SelectItem
                      key={time}
                      value={time}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Meeting Type */}
            <div>
              <Label className="text-base font-semibold">Meeting Type</Label>
              <Select value={meetingType} onValueChange={setMeetingType}>
                <SelectTrigger className="mt-2 h-11">
                  <SelectValue placeholder="Choose meeting type" />
                </SelectTrigger>
                <SelectContent>
                  {meetingTypes.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Meeting Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meeting Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.name}</span>
                  {user.verified && (
                    <Badge variant="outline" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {user.professionalHeadline || "Talented Professional"}
                  </span>
                </div>

                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {user.location.name}
                    </span>
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CalendarIcon className="h-4 w-4" />
                      {selectedDate.toLocaleDateString()} at {selectedTime}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      {selectedMeetingType && (
                        <>
                          <selectedMeetingType.icon className="h-4 w-4" />
                          {selectedMeetingType.label}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-base font-semibold">
                Meeting Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any topics you'd like to discuss or questions you have..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        {selectedDate && selectedTime && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-2">Meeting Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{selectedDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span>{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{selectedMeetingType?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">With:</span>
                  <span>{user.name}</span>
                </div>
                {notes && (
                  <div className="pt-2 border-t">
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="text-sm mt-1">{notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button onClick={handleScheduleMeeting} className="flex-1">
            Schedule Meeting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

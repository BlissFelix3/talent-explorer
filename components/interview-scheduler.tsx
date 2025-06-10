"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarDays, Clock, Video, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InterviewSchedulerProps {
  candidate: {
    id: string
    name: string
    headline: string
  }
}

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]

export function InterviewScheduler({ candidate }: InterviewSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleScheduleInterview = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select both a date and time for the interview.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send the interview request to your backend
    toast({
      title: "Interview scheduled!",
      description: `Interview with ${candidate.name} scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
    })

    setIsOpen(false)
    setSelectedTime("")
    setNotes("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Schedule Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Interview with {candidate.name}</DialogTitle>
          <DialogDescription>
            Select a date and time for your interview with {candidate.name} - {candidate.headline}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Available Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => setSelectedTime(time)}
                    className="justify-center"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interview Details */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Video className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Video Call</p>
                  <p className="text-sm text-muted-foreground">Google Meet</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">60 minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Time Zone</p>
                  <p className="text-sm text-muted-foreground">PST</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Interview Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any specific topics or questions you'd like to discuss..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {selectedDate && selectedTime && (
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-2">Interview Summary</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Candidate:</strong> {candidate.name}
                </p>
                <p>
                  <strong>Date:</strong> {selectedDate.toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {selectedTime}
                </p>
                <p>
                  <strong>Type:</strong> Video Call (Google Meet)
                </p>
                <p>
                  <strong>Duration:</strong> 60 minutes
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleScheduleInterview}>Schedule Interview</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const trendData = [
  { skill: "React", demand: 95, trend: "up", change: 12 },
  { skill: "TypeScript", demand: 88, trend: "up", change: 18 },
  { skill: "Python", demand: 92, trend: "up", change: 8 },
  { skill: "Node.js", demand: 85, trend: "stable", change: 2 },
  { skill: "AWS", demand: 90, trend: "up", change: 15 },
  { skill: "Docker", demand: 78, trend: "up", change: 22 },
  { skill: "Kubernetes", demand: 82, trend: "up", change: 25 },
  { skill: "GraphQL", demand: 65, trend: "down", change: -5 },
]

export function TrendAnalysisChart() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {trendData.map((item) => (
          <div key={item.skill} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{item.skill}</Badge>
              <div className="flex items-center space-x-2">
                {item.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                {item.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                {item.trend === "stable" && <Minus className="h-4 w-4 text-yellow-500" />}
                <span
                  className={`text-sm font-medium ${
                    item.trend === "up" ? "text-green-500" : item.trend === "down" ? "text-red-500" : "text-yellow-500"
                  }`}
                >
                  {item.change > 0 ? "+" : ""}
                  {item.change}%
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Market Demand</p>
                <p className="font-semibold">{item.demand}%</p>
              </div>
              <div className="w-24 bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item.demand}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold">Growing Skills</h4>
              <p className="text-2xl font-bold text-green-500">6</p>
              <p className="text-sm text-muted-foreground">Skills trending up</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Minus className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-semibold">Stable Skills</h4>
              <p className="text-2xl font-bold text-yellow-500">1</p>
              <p className="text-sm text-muted-foreground">Skills holding steady</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingDown className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h4 className="font-semibold">Declining Skills</h4>
              <p className="text-2xl font-bold text-red-500">1</p>
              <p className="text-sm text-muted-foreground">Skills trending down</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

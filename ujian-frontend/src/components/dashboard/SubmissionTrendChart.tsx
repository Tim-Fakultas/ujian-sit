"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { month: "Jan", submissions: 45 },
  { month: "Feb", submissions: 52 },
  { month: "Mar", submissions: 48 },
  { month: "Apr", submissions: 61 },
  { month: "May", submissions: 55 },
  { month: "Jun", submissions: 67 },
]

const chartConfig = {
  submissions: {
    label: "Pengajuan",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function SubmissionTrendChart() {
  return (
    <Card className="col-span-1 lg:col-span-2 border-border/50 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-xl font-bold tracking-tight">Tren Pengajuan Ranpel</CardTitle>
                <CardDescription>Jumlah pengajuan rancangan penelitian 6 bulan terakhir.</CardDescription>
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                +12% vs last month
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12, top: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              type="monotone"
              dataKey="submissions"
              stroke="var(--color-submissions)"
              strokeWidth={4}
              dot={{ r: 4, fill: "var(--color-submissions)", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

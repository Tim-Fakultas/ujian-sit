"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { prodi: "Teknik Informatika", mahasiswa: 450, color: "var(--chart-1)" },
  { prodi: "Sistem Informasi", mahasiswa: 380, color: "var(--chart-2)" },
  { prodi: "Matematika", mahasiswa: 120, color: "var(--chart-3)" },
  { prodi: "Biologi", mahasiswa: 210, color: "var(--chart-4)" },
  { prodi: "Kimia", mahasiswa: 150, color: "var(--chart-5)" },
]

const chartConfig = {
  mahasiswa: {
    label: "Total Mahasiswa",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function ProdiChart() {
  return (
    <Card className="col-span-1 lg:col-span-2 border-border/50 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Distribusi Mahasiswa per Prodi</CardTitle>
        <CardDescription>Visualisasi jumlah mahasiswa aktif pada setiap program studi.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="prodi"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.split(' ').map((word: string) => word[0]).join('')}
              className="font-bold text-xs"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="mahasiswa"
              fill="var(--color-mahasiswa)"
              radius={8}
              barSize={32}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

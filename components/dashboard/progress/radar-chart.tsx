"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@react-email/components";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RotateCcw } from "lucide-react";

type RadarChartDataProps = {
  category: string;
  tests: number;
  averageGrade: number;
};

export default function RadarChartComponent() {
  const { data: chartData, isPending } = useQuery({
    queryKey: ["radarChartData"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/progress");
      let chartData = response.data.data as RadarChartDataProps[];

      const allCategories = [
        "science",
        "math",
        "social study",
        "language",
        "programming",
        "others",
      ];

      const existingCategories = chartData.map((item) => item.category);

      const missingCategories = allCategories
        .filter((category) => !existingCategories.includes(category))
        .slice(0, Math.max(0, 6 - chartData.length)); // Pastikan totalnya 6 kategori

      const filledChartData = [
        ...chartData,
        ...missingCategories.map((category) => ({
          category,
          tests: 0, // Default nilai jika belum ada data
          averageGrade: 0,
        })),
      ];

      return filledChartData;
    },
  });

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle className="text-xl font-medium text-gray-800">
          Most Popular Test Categories
        </CardTitle>
        <CardDescription className="text-gray-500">
          Number of tests taken and completion rates by category
        </CardDescription>
      </CardHeader>
      {isPending ? (
        <CardContent className="flex h-1/2 flex-col items-center justify-end gap-6 pb-0">
          <Loader2 className="h-8 w-8 animate-spin" />
          Loading...
        </CardContent>
      ) : (
        <CardContent className="pb-0">
          {chartData ? (
            <ChartContainer
              config={{
                tests: {
                  label: "Tests Taken",
                  color: "hsl(var(--chart-2))",
                },
                averageGrade: {
                  label: "Average Grade (%) ",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="aspect-square max-h-[300px] w-full"
            >
              <RadarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  bottom: 10,
                  left: 10,
                }}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <PolarAngleAxis
                  dataKey="category"
                  tick={({ x, y, textAnchor, value, index, ...props }) => {
                    const data = chartData[index];

                    return (
                      <text
                        x={x}
                        y={index === 0 ? y - 10 : y}
                        textAnchor={textAnchor}
                        fontSize={13}
                        fontWeight={500}
                        {...props}
                      >
                        <tspan>{data.tests}</tspan>
                        <tspan className="fill-muted-foreground">/</tspan>
                        <tspan>{data.averageGrade}%</tspan>
                        <tspan
                          x={x}
                          dy={"1rem"}
                          fontSize={12}
                          className="fill-muted-foreground"
                        >
                          {data.category.replace(
                            data.category.charAt(0),
                            data.category.charAt(0).toUpperCase(),
                          )}
                        </tspan>
                      </text>
                    );
                  }}
                />

                <PolarGrid />
                <Radar
                  dataKey="tests"
                  fill="var(--color-tests)"
                  fillOpacity={0.6}
                  stroke="var(--color-tests)"
                  strokeWidth={2}
                />
                <Radar
                  dataKey="averageGrade"
                  fill="var(--color-averageGrade)"
                  fillOpacity={0.4}
                  stroke="var(--color-averageGrade)"
                  strokeWidth={2}
                />
              </RadarChart>
            </ChartContainer>
          ) : (
            <div>
              <div>Failed to load data</div>
              <Button className="flex">
                <RotateCcw />
                Reload
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

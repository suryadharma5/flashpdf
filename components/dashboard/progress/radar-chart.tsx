"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { Button } from "@/components/ui/button"; // Changed from @react-email/components
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
import { useIsMobile } from "@/hooks/use-mobile";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

type RadarChartDataProps = {
  category: string;
  tests: number;
  averageGrade: number;
};

export default function RadarChartComponent() {
  const t = useTranslations("progress");
  const isMobile = useIsMobile();

  const {
    data: chartData,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["radarChartData"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/progress");
      let chartData = response.data.data as RadarChartDataProps[];

      // Deduplicate categories by combining tests and averaging grades
      const categoryMap = new Map<string, RadarChartDataProps>();

      chartData.forEach((item) => {
        if (categoryMap.has(item.category)) {
          const existing = categoryMap.get(item.category)!;
          existing.tests += item.tests;
          // Weighted average for grades
          const totalTests = existing.tests;
          existing.averageGrade =
            (existing.averageGrade * (totalTests - item.tests) +
              item.averageGrade * item.tests) /
            totalTests;
          categoryMap.set(item.category, existing);
        } else {
          categoryMap.set(item.category, { ...item });
        }
      });

      // Convert back to array
      chartData = Array.from(categoryMap.values());

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
        .slice(0, Math.max(0, 6 - chartData.length)); // Ensure total of 6 categories

      const filledChartData = [
        ...chartData,
        ...missingCategories.map((category) => ({
          category,
          tests: 0, // Default value if no data exists
          averageGrade: 0,
        })),
      ];

      console.log({ filledChartData });

      return filledChartData;
    },
  });

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle className="text-xl font-medium text-gray-800">
          {t("radarChtTitle")}
        </CardTitle>
        <CardDescription className="text-gray-500">
          {t("radarChtDesc")}
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
                  label: "Average Grade ",
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
                style={
                  {
                    // Define CSS variables inline
                    "--color-tests": "hsl(var(--chart-2))",
                    "--color-averageGrade": "hsl(var(--chart-4))",
                  } as React.CSSProperties
                }
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <PolarAngleAxis
                  dataKey="category"
                  tick={(props) => {
                    const { x, y, textAnchor, index } = props;

                    // Pastikan data ada - jika tidak, kembalikan elemen kosong bukan null
                    if (!chartData || index >= chartData.length) {
                      return <text />; // Return empty text element instead of null
                    }

                    const data = chartData[index];

                    return (
                      <text
                        x={x}
                        y={index === 0 ? y - 10 : y}
                        textAnchor={textAnchor}
                        fontSize={13}
                        fontWeight={500}
                      >
                        {isMobile ? (
                          <></>
                        ) : (
                          <>
                            <tspan>{data.tests}</tspan>
                            <tspan className="fill-muted-foreground">/</tspan>
                            <tspan>{data.averageGrade.toFixed(1)}</tspan>
                          </>
                        )}
                        <tspan
                          x={x}
                          dy={"1rem"}
                          fontSize={isMobile ? 8 : 12}
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
                  name="Tests"
                  dataKey="tests"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.6}
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                />
                <Radar
                  name="Average Grade"
                  dataKey="averageGrade"
                  fill="hsl(var(--chart-4))"
                  fillOpacity={0.4}
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                />
              </RadarChart>
            </ChartContainer>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-4">
              <div>Failed to load data</div>
              <Button
                onClick={() => refetch()}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reload
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

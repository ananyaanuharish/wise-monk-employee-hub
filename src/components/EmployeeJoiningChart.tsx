
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp, Users } from "lucide-react";
import { useEmployeeAnalytics } from "@/hooks/useEmployeeAnalytics";

const EmployeeJoiningChart = () => {
  const { monthlyJoiningData, loading } = useEmployeeAnalytics();

  const chartConfig = {
    count: {
      label: "New Joinings",
      color: "hsl(var(--primary))",
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Employee Joining Analytics
          </CardTitle>
          <CardDescription>Loading joining data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalJoinings = monthlyJoiningData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Employee Joining Analytics
        </CardTitle>
        <CardDescription>
          Month-over-month new employee joinings for the last 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Total new joinings: <strong className="text-foreground">{totalJoinings}</strong></span>
          </div>
        </div>
        
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyJoiningData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value, name) => [
                      `${value} new ${value === 1 ? 'joining' : 'joinings'}`,
                      'New Employees'
                    ]}
                  />
                }
              />
              <Bar 
                dataKey="count" 
                fill="var(--color-count)" 
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default EmployeeJoiningChart;

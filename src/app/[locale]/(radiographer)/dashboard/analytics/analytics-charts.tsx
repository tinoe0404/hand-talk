"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { Hand, PlayCircle } from "lucide-react";

interface AnalyticsChartsProps {
    gestures: { name: string; count: number }[];
    instructions: { name: string; count: number }[];
}

const COLORS = ["#004d40", "#00796b", "#009688", "#4db6ac", "#80cbc4"];
const PIE_COLORS = ["#1e1b4b", "#312e81", "#4338ca", "#4f46e5", "#6366f1"];

export function AnalyticsCharts({ gestures, instructions }: AnalyticsChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Gestures Chart */}
            <Card className="border-2 shadow-sm border-zinc-100 overflow-hidden">
                <CardHeader className="bg-zinc-50 border-b-2 border-zinc-100">
                    <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight text-zinc-800">
                        <Hand className="w-5 h-5 text-indigo-600" />
                        Most Frequent Patient Gestures
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 h-[350px]">
                    {gestures.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={gestures}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {gestures.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#18181b', fontWeight: 900 }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-xs font-bold text-zinc-600">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                            <Hand className="w-12 h-12 mb-3 opacity-20" />
                            <p className="text-sm font-bold uppercase tracking-widest">No Gesture Data</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Top Instructions Chart */}
            <Card className="border-2 shadow-sm border-zinc-100 overflow-hidden">
                <CardHeader className="bg-zinc-50 border-b-2 border-zinc-100">
                    <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight text-zinc-800">
                        <PlayCircle className="w-5 h-5 text-medical-green-600" />
                        Top Broadcasted Instructions
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 h-[350px]">
                    {instructions.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={instructions}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" />
                                <XAxis type="number" tick={{ fontSize: 12, fill: '#71717a', fontWeight: 'bold' }} stroke="#a1a1aa" />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tick={{ fontSize: 10, fill: '#3f3f46', fontWeight: 'bold' }}
                                    width={100}
                                    stroke="#a1a1aa"
                                />
                                <Tooltip
                                    cursor={{ fill: '#f4f4f5' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#004d40', fontWeight: 900 }}
                                />
                                <Bar dataKey="count" fill="#004d40" radius={[0, 6, 6, 0]}>
                                    {instructions.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                            <PlayCircle className="w-12 h-12 mb-3 opacity-20" />
                            <p className="text-sm font-bold uppercase tracking-widest">No Instruction Data</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

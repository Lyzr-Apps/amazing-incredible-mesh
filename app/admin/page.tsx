'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import {
  MessageSquare,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  Download,
  RefreshCw,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

// Sample analytics data
const CONVERSATION_DATA = [
  { date: 'Mon', conversations: 145, resolved: 128, escalated: 17 },
  { date: 'Tue', conversations: 198, resolved: 175, escalated: 23 },
  { date: 'Wed', conversations: 167, resolved: 152, escalated: 15 },
  { date: 'Thu', conversations: 212, resolved: 189, escalated: 23 },
  { date: 'Fri', conversations: 234, resolved: 211, escalated: 23 },
  { date: 'Sat', conversations: 89, resolved: 81, escalated: 8 },
  { date: 'Sun', conversations: 76, resolved: 69, escalated: 7 }
]

const RESPONSE_TIME_DATA = [
  { time: '12 AM', avgTime: 2.3 },
  { time: '4 AM', avgTime: 1.8 },
  { time: '8 AM', avgTime: 3.2 },
  { time: '12 PM', avgTime: 4.1 },
  { time: '4 PM', avgTime: 3.8 },
  { time: '8 PM', avgTime: 2.9 },
  { time: '11 PM', avgTime: 2.1 }
]

const SATISFACTION_DATA = [
  { name: 'Very Satisfied (5)', value: 485, color: '#10b981' },
  { name: 'Satisfied (4)', value: 312, color: '#3b82f6' },
  { name: 'Neutral (3)', value: 156, color: '#f59e0b' },
  { name: 'Dissatisfied (2)', value: 78, color: '#ef4444' },
  { name: 'Very Dissatisfied (1)', value: 19, color: '#7c3aed' }
]

const QUERY_CATEGORIES = [
  { category: 'Account & Login', count: 342, percentage: 28 },
  { category: 'Billing & Payments', count: 256, percentage: 21 },
  { category: 'Technical Support', count: 198, percentage: 16 },
  { category: 'Product Features', count: 217, percentage: 18 },
  { category: 'Refunds & Returns', count: 145, percentage: 12 },
  { category: 'Other', count: 62, percentage: 5 }
]

const CONVERSATION_LOGS = [
  {
    id: '1',
    customer: 'John Doe',
    email: 'john@example.com',
    query: 'How do I reset my password?',
    agent_response: 'To reset your password, click on "Forgot Password"...',
    confidence: 0.95,
    resolved: true,
    duration: '2m 34s',
    timestamp: '2024-11-03 14:23',
    satisfaction: 5
  },
  {
    id: '2',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    query: 'What is your refund policy?',
    agent_response: 'Our refund policy allows returns within 30 days...',
    confidence: 0.88,
    resolved: true,
    duration: '1m 12s',
    timestamp: '2024-11-03 14:15',
    satisfaction: 4
  },
  {
    id: '3',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    query: 'Integration with Slack not working',
    agent_response: 'I need to escalate this to our technical team...',
    confidence: 0.42,
    resolved: false,
    duration: '4m 18s',
    timestamp: '2024-11-03 13:58',
    satisfaction: null
  },
  {
    id: '4',
    customer: 'Sarah Williams',
    email: 'sarah@example.com',
    query: 'How much does the Pro plan cost?',
    agent_response: 'The Pro plan costs $29 per month and includes...',
    confidence: 0.92,
    resolved: true,
    duration: '1m 45s',
    timestamp: '2024-11-03 13:42',
    satisfaction: 5
  },
  {
    id: '5',
    customer: 'Tom Brown',
    email: 'tom@example.com',
    query: 'Can I upgrade my plan mid-cycle?',
    agent_response: 'Yes, you can upgrade at any time and prorated charges...',
    confidence: 0.85,
    resolved: true,
    duration: '2m 01s',
    timestamp: '2024-11-03 13:28',
    satisfaction: 4
  }
]

const AGENT_METRICS = {
  totalConversations: 1121,
  averageResolutionRate: 94.2,
  averageConfidence: 0.87,
  averageResponseTime: 3.1,
  customerSatisfaction: 4.6,
  escalationRate: 5.8
}

const NAVIGATION_ITEMS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'conversations', label: 'Conversations', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'performance', label: 'Performance', icon: CheckCircle },
  { id: 'settings', label: 'Settings', icon: Settings }
]

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [timeRange, setTimeRange] = useState('week')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [resolutionFilter, setResolutionFilter] = useState('all')

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return CONVERSATION_LOGS.filter(conv => {
      const matchesSearch = conv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.query.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesResolution = resolutionFilter === 'all' ||
        (resolutionFilter === 'resolved' && conv.resolved) ||
        (resolutionFilter === 'unresolved' && !conv.resolved)

      return matchesSearch && matchesResolution
    })
  }, [searchQuery, resolutionFilter])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Support Admin</h1>
          <p className="text-xs text-gray-400 mt-1">Analytics Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          {NAVIGATION_ITEMS.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <Separator className="bg-gray-800 my-4" />

        <div className="p-4 space-y-2">
          <Link href="/">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Chat</span>
            </button>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <Download className="h-5 w-5" />
            <span className="text-sm font-medium">Export Data</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex-1 mx-6 flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Conversations</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {AGENT_METRICS.totalConversations.toLocaleString()}
                        </p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-2">+12% from last week</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Resolution Rate</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {AGENT_METRICS.averageResolutionRate}%
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-2">+2.1% improvement</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg Confidence</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {(AGENT_METRICS.averageConfidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-2">+3% this month</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg Response Time</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {AGENT_METRICS.averageResponseTime}s
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                    <p className="text-xs text-red-600 mt-2">+0.2s slower</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Satisfaction</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {AGENT_METRICS.customerSatisfaction}/5
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-pink-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-2">+0.3 from last month</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Escalation Rate</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {AGENT_METRICS.escalationRate}%
                        </p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-2">-1.2% improvement</p>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Conversation Trends */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={CONVERSATION_DATA}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="conversations" fill="#3b82f6" name="Total" />
                        <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                        <Bar dataKey="escalated" fill="#ef4444" name="Escalated" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Response Time Trend */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time by Hour</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={RESPONSE_TIME_DATA}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="avgTime" stroke="#f59e0b" name="Avg Time (s)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer Satisfaction */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Satisfaction Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={SATISFACTION_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {SATISFACTION_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Query Categories */}
                  <Card className="p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Query Categories</h3>
                    <div className="space-y-3">
                      {QUERY_CATEGORIES.map((cat, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                            <span className="text-sm text-gray-600">{cat.count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${cat.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Conversations Tab */}
            {activeTab === 'conversations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Conversation Logs</h2>
                  <div className="flex gap-2">
                    <Select value={resolutionFilter} onValueChange={setResolutionFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conversations</SelectItem>
                        <SelectItem value="resolved">Resolved Only</SelectItem>
                        <SelectItem value="unresolved">Unresolved Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold text-gray-900">Customer</th>
                          <th className="px-6 py-3 text-left font-semibold text-gray-900">Query</th>
                          <th className="px-6 py-3 text-left font-semibold text-gray-900">Confidence</th>
                          <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                          <th className="px-6 py-3 text-left font-semibold text-gray-900">Duration</th>
                          <th className="px-6 py-3 text-left font-semibold text-gray-900">Satisfaction</th>
                          <th className="px-6 py-3 text-left font-semibold text-gray-900">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredConversations.map(conv => (
                          <tr key={conv.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900">{conv.customer}</p>
                                <p className="text-xs text-gray-500">{conv.email}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="max-w-xs truncate text-gray-700">{conv.query}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-12 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      conv.confidence > 0.8 ? 'bg-green-600' : 'bg-orange-600'
                                    }`}
                                    style={{ width: `${conv.confidence * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-600">
                                  {Math.round(conv.confidence * 100)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {conv.resolved ? (
                                <Badge className="bg-green-100 text-green-800 border-0">Resolved</Badge>
                              ) : (
                                <Badge className="bg-orange-100 text-orange-800 border-0">Escalated</Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 text-gray-600">{conv.duration}</td>
                            <td className="px-6 py-4">
                              {conv.satisfaction ? (
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-lg ${
                                        i < conv.satisfaction ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">Pending</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500">{conv.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {filteredConversations.length} of {CONVERSATION_LOGS.length} conversations
                  </p>
                  <Button variant="outline">Load More</Button>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Detailed Analytics</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Query Resolution Funnel</h3>
                    <div className="space-y-4">
                      {[
                        { stage: 'Total Inquiries', count: 1121, width: 100 },
                        { stage: 'AI Attempted', count: 1089, width: 97 },
                        { stage: 'AI Resolved', count: 1055, width: 94 },
                        { stage: 'Customer Satisfied', count: 985, width: 88 }
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{item.stage}</span>
                            <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${item.width}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Metrics Comparison</h3>
                    <div className="space-y-4">
                      {[
                        { metric: 'Resolution Rate', current: 94.2, target: 95, unit: '%' },
                        { metric: 'Avg Confidence', current: 87, target: 90, unit: '%' },
                        { metric: 'Customer Satisfaction', current: 4.6, target: 4.8, unit: '/5' },
                        { metric: 'Response Speed', current: 3.1, target: 2.5, unit: 's' }
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">{item.metric}</span>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {item.current}{item.unit}
                              </p>
                              <p className="text-xs text-gray-500">Target: {item.target}{item.unit}</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                item.current >= item.target ? 'bg-green-600' : 'bg-orange-600'
                              }`}
                              style={{ width: `${Math.min((item.current / item.target) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={CONVERSATION_DATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="conversations" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Agent Performance</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: 'Response Accuracy',
                      value: '87%',
                      trend: '+2%',
                      color: 'text-blue-600'
                    },
                    {
                      label: 'Resolution Rate',
                      value: '94.2%',
                      trend: '+2.1%',
                      color: 'text-green-600'
                    },
                    {
                      label: 'Customer Satisfaction',
                      value: '4.6/5',
                      trend: '+0.3',
                      color: 'text-pink-600'
                    }
                  ].map((metric, idx) => (
                    <Card key={idx} className="p-4">
                      <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                      <p className={`text-3xl font-bold ${metric.color} mb-1`}>{metric.value}</p>
                      <p className="text-xs text-green-600">Week: {metric.trend}</p>
                    </Card>
                  ))}
                </div>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={CONVERSATION_DATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" />
                      <Line type="monotone" dataKey="escalated" stroke="#ef4444" name="Escalated" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Topics</h3>
                  <div className="space-y-3">
                    {[
                      { topic: 'Password Reset', accuracy: 98, count: 156 },
                      { topic: 'Pricing Information', accuracy: 96, count: 142 },
                      { topic: 'Account Management', accuracy: 92, count: 128 },
                      { topic: 'Billing Questions', accuracy: 89, count: 115 },
                      { topic: 'Feature Overview', accuracy: 85, count: 98 }
                    ].map((item, idx) => (
                      <div key={idx} className="border-b border-gray-200 pb-3 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{item.topic}</span>
                          <span className="text-sm text-gray-600">{item.count} queries</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${item.accuracy}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{item.accuracy}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agent Model
                      </label>
                      <Select defaultValue="gpt-4o">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o">GPT-4o (Current)</SelectItem>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                          <SelectItem value="gpt-35">GPT-3.5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temperature (Creativity): 0.3
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0.3"
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Lower values = more focused and deterministic responses
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Response Language
                      </label>
                      <Select defaultValue="english">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Escalation Alerts</p>
                        <p className="text-sm text-gray-600">Get notified when queries need escalation</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Daily Reports</p>
                        <p className="text-sm text-gray-600">Receive daily performance summaries</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Low Satisfaction Alerts</p>
                        <p className="text-sm text-gray-600">Alert when customer satisfaction drops</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export All Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Knowledge Base
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

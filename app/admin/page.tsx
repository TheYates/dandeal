import { db } from "@/lib/db";
import { consultationSubmissions, quoteSubmissions } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MessageSquare, FileText, CheckCircle, Clock } from "lucide-react";

export default async function AdminDashboard() {
  // Fetch statistics
  const consultationStats = await db
    .select({
      total: sql<number>`count(*)::int`,
      new: sql<number>`count(*) filter (where status = 'new')::int`,
      inProgress: sql<number>`count(*) filter (where status = 'in_progress')::int`,
      completed: sql<number>`count(*) filter (where status = 'completed')::int`,
    })
    .from(consultationSubmissions);

  const quoteStats = await db
    .select({
      total: sql<number>`count(*)::int`,
      new: sql<number>`count(*) filter (where status = 'new')::int`,
      quoted: sql<number>`count(*) filter (where status = 'quoted')::int`,
      completed: sql<number>`count(*) filter (where status = 'completed')::int`,
    })
    .from(quoteSubmissions);

  // Fetch recent submissions
  const recentConsultations = await db.query.consultationSubmissions.findMany({
    orderBy: (consultations, { desc }) => [desc(consultations.createdAt)],
    limit: 5,
  });

  const recentQuotes = await db.query.quoteSubmissions.findMany({
    orderBy: (quotes, { desc }) => [desc(quotes.createdAt)],
    limit: 5,
  });

  const stats = consultationStats[0];
  const qStats = quoteStats[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-orange-900 to-orange-800 border-orange-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">
              Total Consultations
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-orange-300">
              {stats.new} new, {stats.inProgress} in progress
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Total Quotes</CardTitle>
            <FileText className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{qStats.total}</div>
            <p className="text-xs text-blue-300">
              {qStats.new} new, {qStats.quoted} quoted
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900 to-yellow-800 border-yellow-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-100">Pending Items</CardTitle>
            <Clock className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.new + qStats.new}</div>
            <p className="text-xs text-yellow-300">Require attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Completed</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.completed + qStats.completed}
            </div>
            <p className="text-xs text-green-300">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Consultations */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConsultations.length === 0 ? (
                <p className="text-sm text-gray-400">No consultations yet</p>
              ) : (
                recentConsultations.map((consultation) => (
                  <Link
                    key={consultation.id}
                    href={`/admin/consultations/${consultation.id}`}
                    className="block p-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition bg-gray-900"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-white">
                          {consultation.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {consultation.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {consultation.service}
                        </p>
                      </div>
                      <Badge
                        variant={
                          consultation.status === "new"
                            ? "default"
                            : consultation.status === "completed"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {consultation.status}
                      </Badge>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Quotes */}
        <Card className="bg-black border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuotes.length === 0 ? (
                <p className="text-sm text-gray-400">No quotes yet</p>
              ) : (
                recentQuotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/admin/quotes/${quote.id}`}
                    className="block p-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition bg-gray-900"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-white">
                          {quote.firstName} {quote.lastName}
                        </p>
                        <p className="text-sm text-gray-400">{quote.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {quote.origin} → {quote.destination}
                        </p>
                      </div>
                      <Badge
                        variant={
                          quote.status === "new"
                            ? "default"
                            : quote.status === "completed"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {quote.status}
                      </Badge>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

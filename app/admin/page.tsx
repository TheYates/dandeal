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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Consultations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.new} new, {stats.inProgress} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <FileText className="h-4 w-4 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {qStats.new} new, {qStats.quoted} quoted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new + qStats.new}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completed + qStats.completed}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Consultations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConsultations.length === 0 ? (
                <p className="text-sm text-gray-500">No consultations yet</p>
              ) : (
                recentConsultations.map((consultation) => (
                  <Link
                    key={consultation.id}
                    href={`/admin/consultations/${consultation.id}`}
                    className="block p-3 rounded-lg border hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {consultation.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {consultation.email}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuotes.length === 0 ? (
                <p className="text-sm text-gray-500">No quotes yet</p>
              ) : (
                recentQuotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/admin/quotes/${quote.id}`}
                    className="block p-3 rounded-lg border hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {quote.firstName} {quote.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{quote.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
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

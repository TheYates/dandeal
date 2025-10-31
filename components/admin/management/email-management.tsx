"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Mail, Plus, Trash2, Send, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface EmailSetting {
  id: string;
  formType: string;
  recipientEmails: string[];
  enabled: boolean;
  subjectTemplate: string;
  includeFormData: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmailLog {
  id: string;
  formType: string;
  recipientEmail: string;
  subject: string;
  status: "sent" | "failed" | "pending";
  errorMessage: string | null;
  sentAt: string | null;
  createdAt: string;
}

export function EmailManagement() {
  const supabase = createClient();
  const [settings, setSettings] = useState<EmailSetting[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testFormType, setTestFormType] = useState("quote");

  useEffect(() => {
    fetchSettings();
    fetchLogs();
  }, []);

  const fetchSettings = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      const response = await fetch("/api/admin/email-settings", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        toast.error("Failed to fetch email settings");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch email settings");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const response = await fetch("/api/admin/email-logs?limit=50", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handleAddEmail = (formType: string) => {
    const setting = settings.find((s) => s.formType === formType);
    if (!setting) return;

    const newEmails = [...setting.recipientEmails, ""];
    updateSetting(formType, { ...setting, recipientEmails: newEmails });
  };

  const handleRemoveEmail = (formType: string, index: number) => {
    const setting = settings.find((s) => s.formType === formType);
    if (!setting) return;

    const newEmails = setting.recipientEmails.filter((_, i) => i !== index);
    updateSetting(formType, { ...setting, recipientEmails: newEmails });
  };

  const handleEmailChange = (
    formType: string,
    index: number,
    value: string
  ) => {
    const setting = settings.find((s) => s.formType === formType);
    if (!setting) return;

    const newEmails = [...setting.recipientEmails];
    newEmails[index] = value;
    updateSetting(formType, { ...setting, recipientEmails: newEmails });
  };

  const updateSetting = async (
    formType: string,
    updatedSetting: EmailSetting
  ) => {
    setSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      const response = await fetch("/api/admin/email-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          formType,
          recipientEmails: updatedSetting.recipientEmails,
          enabled: updatedSetting.enabled,
          subjectTemplate: updatedSetting.subjectTemplate,
          includeFormData: updatedSetting.includeFormData,
        }),
      });

      if (response.ok) {
        setSettings((prev) =>
          prev.map((s) => (s.formType === formType ? updatedSetting : s))
        );
        toast.success("Email settings updated");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Error updating settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast.error("Please enter a test email address");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/email-settings/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formType: testFormType,
          testEmail,
        }),
      });

      if (response.ok) {
        toast.success("Test email sent successfully");
        setTestEmail("");
      } else {
        toast.error("Failed to send test email");
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Error sending test email");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading email settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Email Recipients Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-orange-600" />
            <div>
              <CardTitle>Email Recipients</CardTitle>
              <CardDescription>
                Manage email addresses for form notifications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {settings.map((setting) => (
            <div
              key={setting.formType}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold capitalize">
                    {setting.formType} Form
                  </h3>
                  <p className="text-sm text-gray-500">
                    {setting.recipientEmails.length} recipient(s)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Enabled</span>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={(checked) =>
                      updateSetting(setting.formType, {
                        ...setting,
                        enabled: checked,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                {setting.recipientEmails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        handleEmailChange(
                          setting.formType,
                          index,
                          e.target.value
                        )
                      }
                      placeholder="recipient@example.com"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEmail(setting.formType, index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddEmail(setting.formType)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Email
              </Button>

              <div>
                <label className="text-sm font-medium">Subject Template</label>
                <Input
                  value={setting.subjectTemplate || ""}
                  onChange={(e) =>
                    updateSetting(setting.formType, {
                      ...setting,
                      subjectTemplate: e.target.value,
                    })
                  }
                  placeholder="e.g., New {formType} from {name}"
                  className="mt-1"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Test Email */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-orange-600" />
            <div>
              <CardTitle>Send Test Email</CardTitle>
              <CardDescription>Test email configuration</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Form Type</label>
              <select
                value={testFormType}
                onChange={(e) => setTestFormType(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="quote">Quote</option>
                <option value="consultation">Consultation</option>
                <option value="contact">Contact</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Test Email</label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSendTestEmail}
                disabled={saving}
                className="w-full gap-2 bg-orange-600 hover:bg-orange-700"
              >
                <Send className="w-4 h-4" />
                Send Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-orange-600" />
              <div>
                <CardTitle>Email Logs</CardTitle>
                <CardDescription>Recent email sending history</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={fetchLogs}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Form Type</th>
                  <th className="text-left py-2 px-2">Recipient</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-left py-2 px-2">Sent At</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No email logs yet
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2 capitalize">{log.formType}</td>
                      <td className="py-2 px-2">{log.recipientEmail}</td>
                      <td className="py-2 px-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            log.status === "sent"
                              ? "bg-green-100 text-green-800"
                              : log.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        {log.sentAt
                          ? new Date(log.sentAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

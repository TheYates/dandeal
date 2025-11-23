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
import { Skeleton } from "@/components/ui/skeleton";
import { EmailManagementSkeleton } from "./table-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, Plus, Trash2, RefreshCw } from "lucide-react";
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

interface GlobalEmailSettings {
  enabled: boolean;
  globalEmail: string;
  overrideIndividualSettings: boolean;
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
  const [globalSettings, setGlobalSettings] = useState<GlobalEmailSettings>({
    enabled: false,
    globalEmail: "",
    overrideIndividualSettings: false,
  });
  const [originalGlobalSettings, setOriginalGlobalSettings] = useState<GlobalEmailSettings>({
    enabled: false,
    globalEmail: "",
    overrideIndividualSettings: false,
  });
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [allLogs, setAllLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [logsPerPage] = useState(20);

  useEffect(() => {
    fetchSettings();
    fetchGlobalSettings();
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

  const fetchGlobalSettings = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const response = await fetch("/api/admin/email-settings/global", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGlobalSettings(data);
        setOriginalGlobalSettings(data);
      }
    } catch (error) {
      console.error("Error fetching global settings:", error);
    }
  };

  const fetchLogs = async (limit = 10) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const response = await fetch(`/api/admin/email-logs?limit=${limit}`, {
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

  const fetchAllLogs = async (page = 1) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const offset = (page - 1) * logsPerPage;
      const response = await fetch(`/api/admin/email-logs?limit=${logsPerPage}&offset=${offset}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllLogs(data.logs || data);
        if (data.total) {
          setTotalPages(Math.ceil(data.total / logsPerPage));
        }
      }
    } catch (error) {
      console.error("Error fetching all logs:", error);
    }
  };

  const handleShowMoreLogs = () => {
    setCurrentPage(1);
    fetchAllLogs(1);
    setShowLogsDialog(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAllLogs(page);
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

  const checkForChanges = (newSettings: GlobalEmailSettings) => {
    const hasChanges = 
      newSettings.enabled !== originalGlobalSettings.enabled ||
      newSettings.globalEmail !== originalGlobalSettings.globalEmail ||
      newSettings.overrideIndividualSettings !== originalGlobalSettings.overrideIndividualSettings;
    setHasUnsavedChanges(hasChanges);
  };

  const handleGlobalSettingsChange = (updatedSettings: GlobalEmailSettings) => {
    setGlobalSettings(updatedSettings);
    checkForChanges(updatedSettings);
  };

  const saveGlobalSettings = async () => {
    setSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      const response = await fetch("/api/admin/email-settings/global", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(globalSettings),
      });

      if (response.ok) {
        setOriginalGlobalSettings(globalSettings);
        setHasUnsavedChanges(false);
        toast.success("Global email settings saved successfully");
      } else {
        toast.error("Failed to save global settings");
      }
    } catch (error) {
      console.error("Error updating global settings:", error);
      toast.error("Error updating global settings");
    } finally {
      setSaving(false);
    }
  };

  const resetGlobalSettings = () => {
    setGlobalSettings(originalGlobalSettings);
    setHasUnsavedChanges(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return <EmailManagementSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Global Email Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle>Global Email Settings</CardTitle>
              <CardDescription>
                Send all form submissions to one email address
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Enable Global Email</h3>
              <p className="text-sm text-gray-500">
                Route all form submissions to a single email address
              </p>
            </div>
            <Switch
              checked={globalSettings.enabled}
              onCheckedChange={(checked) =>
                handleGlobalSettingsChange({
                  ...globalSettings,
                  enabled: checked,
                })
              }
            />
          </div>
          
          {globalSettings.enabled && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <label className="text-sm font-medium">Global Email Address</label>
                <Input
                  type="email"
                  value={globalSettings.globalEmail}
                  onChange={(e) =>
                    handleGlobalSettingsChange({
                      ...globalSettings,
                      globalEmail: e.target.value,
                    })
                  }
                  placeholder="admin@example.com"
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Override Individual Settings</h4>
                  <p className="text-xs text-gray-500">
                    When enabled, only the global email will receive notifications
                  </p>
                </div>
                <Switch
                  checked={globalSettings.overrideIndividualSettings}
                  onCheckedChange={(checked) =>
                    handleGlobalSettingsChange({
                      ...globalSettings,
                      overrideIndividualSettings: checked,
                    })
                  }
                />
              </div>
            </div>
          )}
          
          {hasUnsavedChanges && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={saveGlobalSettings}
                disabled={saving}
                className="flex-1"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={resetGlobalSettings}
                variant="outline"
                disabled={saving}
              >
                Reset
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
          {globalSettings.enabled && (
            <div className=" border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Global email is active
                </span>
              </div>
              <p className="text-xs  mt-1">
                All form submissions will be sent to: {globalSettings.globalEmail}
                {!globalSettings.overrideIndividualSettings && " (plus individual recipients)"}
              </p>
            </div>
          )}
          
          {!globalSettings.enabled && settings.map((setting) => (
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
            <Button variant="outline" size="sm" onClick={() => fetchLogs()}>
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
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-2">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="py-2 px-2">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="py-2 px-2">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="py-2 px-2">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No email logs yet
                    </td>
                  </tr>
                ) : (
                  logs.slice(0, 10).map((log) => (
                    <tr key={log.id} className="border-b hover:bg-accent">
                      <td className="py-2 px-2 capitalize">{log.formType}</td>
                      <td className="py-2 px-2">{log.recipientEmail}</td>
                      <td className="py-2 px-2">
                        <span className={`font-medium capitalize ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        {log.sentAt
                          ? new Date(log.sentAt).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true
                            })
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {logs.length >= 10 && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={handleShowMoreLogs}>
                Show More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Logs Dialog */}
      <Dialog open={showLogsDialog} onOpenChange={setShowLogsDialog}>
        <DialogContent className="max-w-[70vw] sm:max-w-[70vw] h-[75vh] flex flex-col p-4">
          <DialogHeader className="flex-shrink-0 pb-2">
            <DialogTitle className="text-lg">Email Logs</DialogTitle>
            <DialogDescription className="text-sm">
              Complete email history
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden border rounded">
            <div className="h-full overflow-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 sticky top-0">
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">Form</th>
                    <th className="text-left py-2 px-3 font-medium">Recipient</th>
                    <th className="text-left py-2 px-3 font-medium">Status</th>
                    <th className="text-left py-2 px-3 font-medium">Sent At</th>
                    <th className="text-left py-2 px-3 font-medium">Subject</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-3">
                          <Skeleton className="h-3 w-12" />
                        </td>
                        <td className="py-2 px-3">
                          <Skeleton className="h-3 w-28" />
                        </td>
                        <td className="py-2 px-3">
                          <Skeleton className="h-3 w-10" />
                        </td>
                        <td className="py-2 px-3">
                          <Skeleton className="h-3 w-20" />
                        </td>
                        <td className="py-2 px-3">
                          <Skeleton className="h-3 w-32" />
                        </td>
                      </tr>
                    ))
                  ) : allLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-muted-foreground">
                        No logs found
                      </td>
                    </tr>
                  ) : (
                    allLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-muted/20">
                        <td className="py-2 px-3 capitalize font-medium text-xs">{log.formType}</td>
                        <td className="py-2 px-3 text-muted-foreground text-xs">{log.recipientEmail}</td>
                        <td className="py-2 px-3">
                          <span className={`font-medium capitalize text-xs ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-muted-foreground text-xs">
                          {log.sentAt
                            ? new Date(log.sentAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : "-"}
                        </td>
                        <td className="py-2 px-3 text-xs max-w-xs truncate" title={log.subject}>
                          {log.subject || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 flex-shrink-0">
              <div className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="h-7 px-2 text-xs"
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="h-7 px-2 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  CreateLog,
  GetLogs,
  AddLogItem,
  GetLogItemsByDate,
  SaveLogItem,
  DeleteLogItem,
  GetAnalytics,
  AddItemLogTag,
  AddTag,
  GetTags,
  RemoveItemTag,
} from "../../wailsjs/go/main/App";
type LogItem = {
  name: string;
  scheduledDate: string;
  description: string;
  id?: number;
  itemCount?: number;
  createdAt?: string;
};

export type LogItemData = {
  details: string;
  status: string;
  sights: string;
  time?: string;
  entryCount?: number;
  types: string;
  title: string;
  date?: string;
  id?: number;
  log_id?: number;
  tags?: Tag[];
};

export type AnalyticsData = {
  completion_rate: number;
  total_tasks: number;
  total_notes: number;
  total_ideas: number;
  insight_count: number;
  streak: number;
};

export type Tag = {
  name: string;
  color: string;
  id?: number;
  log_id?: number;
};
export const useAppStore = defineStore("app", () => {
  // State
  const tab = ref("past");
  const logList = ref<LogItem[]>();
  const activeLog = ref<LogItem>();
  const analytics = ref<AnalyticsData>();

  async function fetchAnalytics() {
    try {
      const result = await GetAnalytics();
      if (result) {
        analytics.value = result;
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
  }

  function attachTag(tagId: number, logId: number) {
    AddItemLogTag(tagId, logId);
  }

  async function addTag(tag: Tag) {
    await AddTag({ color: tag.color, name: tag.name, id: tag.log_id! });
  }

  async function removeTag(tagId?: number, logId?: number) {
    if (tagId == null || logId == null) {
      return;
    }
    await RemoveItemTag(tagId, logId);
  }

  async function fetchLogs(duration: string = "all") {
    try {
      const result = await GetLogs(duration);
      if (result) {
        console.log(result);
        logList.value = result.map((l: any) => ({
          name: l.name,
          description: l.description,
          scheduledDate: l.due_date,
          id: l.id,
          itemCount: l.item_count,
          createdAt: l.created_at,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  }

  async function getTags() {
    try {
      const result = await GetTags();
      return result;
    } catch (err) {
      console.error("Failed to fetch tags:", err);
      return [];
    }
  }

  async function addLog(item: LogItem) {
    try {
      const result = await CreateLog(
        item.name,
        item.description,
        item.scheduledDate,
      );

      if (result) {
        logList.value?.push({
          name: result.name,
          description: result.description,
          scheduledDate: result.due_date,
        });
      }
    } catch (err) {
      console.error("Failed to create log:", err);
    }
  }

  async function createLogItem(item: LogItemData) {
    if (!item.log_id) return;
    try {
      const result = await AddLogItem(
        item.log_id,
        item.title,
        item.details,
        item.status,
        item.sights,
        item.time || "",
        item.types,
      );

      const log = logList.value?.find((v) => v.id == activeLog.value?.id);
      if (log) {
        log.itemCount = (log.itemCount || 0) + 1;
      }
      return result;
    } catch (err) {
      console.error("Failed to add log item:", err);
    }
  }

  async function fetchLogItemsByDate(date: string) {
    try {
      const result = await GetLogItemsByDate(date);
      return result;
    } catch (err) {
      console.error("Failed to fetch log items:", err);
      return [];
    }
  }

  async function saveLogItem(item: any) {
    try {
      const result = await SaveLogItem(item);
      return result;
    } catch (err) {
      console.error("Failed to save log item:", err);
    }
  }

  async function deleteLogItem(id?: number) {
    if (id == null) {
      return;
    }
    try {
      const result = await DeleteLogItem(id);
      const log = logList.value?.find((v) => v.id == activeLog.value?.id);
      if (log) {
        log.itemCount = (log.itemCount || 1) - 1;
      }
      return result;
    } catch (err) {
      console.error("Failed to delete log item:", err);
    }
  }

  return {
    tab,
    activeLog,
    logList,
    deleteLogItem,
    attachTag,
    addTag,
    removeTag,
    addLog,
    getTags,
    fetchLogs,
    createLogItem,
    fetchLogItemsByDate,
    saveLogItem,
    analytics,
    fetchAnalytics,
  };
});

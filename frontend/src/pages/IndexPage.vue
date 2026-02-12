<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { LogItemData, useAppStore } from "../store/app";
import LogItem from "../components/logItem.vue";
import AnalyticsPanel from "../components/AnalyticsPanel.vue";
import { useQuasar } from "quasar";

const showAnalytics = ref(false);
const addLogItem = ref(false);
const tab = ref("tasks");
const appStore = useAppStore();
const items = ref<LogItemData[]>();
const load = async () => {
  if (appStore.activeLog) {
    items.value =
      (await appStore.fetchLogItemsByDate(
        appStore.activeLog.createdAt || "",
      )) || [];
  }
};
watch(
  () => appStore.activeLog,
  () => {
    load();
  },
);
onMounted(() => {
  load();
});

function addNewItem() {
  if (items.value == undefined) {
    return;
  }
  const item = {
    title: `${tab.value} ${items.value.length + 1}`,
    details: "what is this about",
    status: "pending",
    sights: "",
    time: new Date().toLocaleString(),
    types: tab.value,
    date: appStore.activeLog?.scheduledDate,
    log_id: appStore.activeLog?.id,
  };
  items.value.push(item);
  appStore.createLogItem(item);
}
const timeModel = ref();
const editItemAt = ref(-1);

function deleteItem(i: number, id?: number) {
  if (items.value == undefined) {
    return;
  }
  appStore.deleteLogItem(id);
  items.value.splice(i, 1);
}
const $q = useQuasar();
const editTitleRef = ref<HTMLSpanElement>();
function toggleEditAt(i: number) {
  if (editItemAt.value == i) {
    const el = document.querySelector<HTMLSpanElement>(`[title-index="${i}"]`);
    items.value![i].title = el?.innerText || "";
    editItemAt.value = -1;
    saveLogItem(items.value![i], i);

    $q.notify({ message: "title updated", type: "positive" });
  } else {
    editItemAt.value = i;
  }
}

const vEditable = {
  mounted(el: HTMLElement, binding: any) {
    el.innerText = binding.value;

    el.addEventListener("input", () => {
      binding.instance[binding.expression] = el.innerText;
    });
  },
  updated(el: HTMLElement, binding: any) {
    if (el.innerText !== binding.value) {
      el.innerText = binding.value;
    }
  },
};

function saveLogItem(item: LogItemData, index: number) {
  appStore.saveLogItem(item);
  if (items.value == undefined) {
    return;
  }
  items.value[index] = item;
}

function updateTime(item: LogItemData, index: number) {
  if (items.value == undefined) {
    return;
  }
  items.value[index] = item;
  appStore.saveLogItem(item);
}
</script>

<template>
  <q-page padding class="page-container">
    <div v-if="appStore.activeLog" class="q-mb-xl">
      <div class="row items-center justify-between">
        <div>
          <h1 class="text-h4 text-bold q-ma-none text-gradient">
            {{ appStore.activeLog.name }}
          </h1>
          <div class="text-subtitle1 text-grey-5 row items-center q-mt-xs">
            <q-icon name="calendar_today" size="xs" class="q-mr-xs" />
            {{ appStore.activeLog.scheduledDate }}
          </div>
        </div>
        <div class="row q-gutter-sm">
          <q-btn
            outline
            color="primary"
            icon="analytics"
            label="Insights"
            rounded
            @click="showAnalytics = true"
          />
          <q-btn flat round color="grey-5" icon="settings" />
        </div>
      </div>
    </div>

    <div class="tabs-container q-mb-lg">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey-5"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
        no-caps
      >
        <q-tab name="tasks" label="Tasks" />
        <q-tab name="notes" label="Notes" />
        <q-tab name="ideas" label="Ideas" />
      </q-tabs>
    </div>

    <div v-if="items != undefined" class="timeline-wrapper">
      <q-timeline color="primary" layout="dense">
        <q-timeline-entry
          v-for="(item, i) in items"
          :key="i"
          :subtitle="new Date(item.time as string).toLocaleTimeString()"
          class="modern-timeline-entry"
        >
          <template #title>
            <div class="row items-center no-wrap">
              <span
                v-editable="item.title"
                class="text-h6 text-weight-medium"
                :ref="(el) => (editTitleRef = el as HTMLElement)"
                style="outline: none"
                :contenteditable="editItemAt == i"
                :title-index="i"
                :class="{ 'text-primary': editItemAt == i }"
              >
              </span>
              <q-btn
                dense
                round
                color="primary"
                :icon="editItemAt == i ? 'check' : 'edit'"
                size="xs"
                flat
                class="q-ml-sm"
                @click="toggleEditAt(i)"
              />
            </div>
          </template>

          <template #subtitle>
            <div class="row justify-between items-center q-mb-sm">
              <div
                class="text-caption text-grey-5 row items-center cursor-pointer time-badge"
              >
                <q-icon name="schedule" size="xs" class="q-mr-xs" />
                {{
                  new Date(item.time as string).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
                <q-menu
                  @before-show="
                    timeModel = new Date(item.time as string).toTimeString()
                  "
                >
                  <q-time
                    @update:model-value="
                      (v) => {
                        item.time = item.time?.split(' ')[0] + ` ${v}`;
                        updateTime(item, i);
                      }
                    "
                    v-model="timeModel"
                    mask="hh:mm:ss"
                    format24h
                    color="primary"
                  />
                </q-menu>
              </div>
              <div>
                <q-btn
                  size="sm"
                  flat
                  dense
                  round
                  color="grey-6"
                  icon="more_vert"
                >
                  <q-menu auto-close class="smart-border">
                    <q-list style="min-width: 120px">
                      <q-item
                        clickable
                        @click="deleteItem(i, item.id)"
                        class="text-negative"
                      >
                        <q-item-section avatar>
                          <q-icon name="delete" size="xs" />
                        </q-item-section>
                        <q-item-section>Delete</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </template>
          <div class="item-content-wrapper">
            <log-item
              :log-item-data="item"
              @updateItem="
                (v) => {
                  saveLogItem(v, i);
                }
              "
            />
          </div>
        </q-timeline-entry>
      </q-timeline>
    </div>

    <q-page-sticky position="bottom-right" :offset="[24, 24]">
      <q-btn
        color="primary"
        icon="add"
        fab
        label="New Entry"
        rounded
        no-caps
        padding="sm lg"
        unelevated
        class="modern-shadow"
        @click="addNewItem"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
    </q-page-sticky>
    <q-dialog v-model="showAnalytics" persistent backdrop-filter="blur(4px)">
      <q-card
        class="glass-card smart-border"
        style="width: 100%; max-width: 700px"
      >
        <q-card-section class="row items-center justify-between">
          <div class="text-h6 text-gradient">System Analytics</div>
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-none">
          <analytics-panel />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

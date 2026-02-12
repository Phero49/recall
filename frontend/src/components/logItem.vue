<template>
  <div class="q-mb-md">
    <q-card flat class="glass-card smart-border modern-shadow">
      <q-card-section class="q-pb-none">
        <div class="row items-start no-wrap">
          <div class="col-11">
            <q-editor
              content-class="text-subtitle1"
              style="border-radius: 10px"
              :readonly="!editDetails"
              :toolbar="!editDetails ? [] : bodyToolbar"
              v-if="logItemData?.details"
              v-model="logItemData.details"
              min-height="3rem"
              flat
            />

            <!-- <div ref="detailsRef" class="text-body1 text-grey-2" :contenteditable="editDetails"
                            :class="{ 'editing-mode': editDetails, 'text-strike text-grey-6': logItemData?.status === 'completed' }"
                            style="outline: none; min-height: 24px; width: 100%; border-radius: 4px; padding: 4px;">
                            {{ logItemData?.details }}
                        </div> -->
          </div>
          <div class="col-1">
            <q-btn
              dense
              round
              color="primary"
              :icon="editDetails ? 'check' : 'edit_note'"
              size="sm"
              flat
              class="q-ml-sm"
              @click="toggleEdit"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="row justify-between items-center q-pt-md">
        <div class="row q-gutter-x-sm items-center">
          <q-chip
            outline
            v-if="logItemData?.types?.toLowerCase() == 'tasks'"
            size="sm"
            :color="getStatusStyles().color"
            class="status-chip"
          >
            <q-icon
              :name="getStatusStyles().icon"
              size="16px"
              class="q-mr-xs"
            />
            <span class="text-weight-bold">{{ getStatusStyles().label }}</span>
          </q-chip>
          <q-btn-dropdown
            v-if="logItemData?.types?.toLowerCase() == 'tasks'"
            flat
            label="Update Status"
            size="sm"
            color="grey-5"
            no-caps
            dense
            class="status-dropdown"
          >
            <q-list class="smart-border">
              <q-item
                clickable
                v-close-popup
                @click="updateStatus('completed')"
                class="text-positive"
              >
                <q-item-section side
                  ><q-icon name="check" size="xs" color="positive"
                /></q-item-section>
                <q-item-section
                  ><q-item-label>Done</q-item-label></q-item-section
                >
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="updateStatus('failed')"
                class="text-negative"
              >
                <q-item-section side
                  ><q-icon name="close" size="xs" color="negative"
                /></q-item-section>
                <q-item-section
                  ><q-item-label>Failed</q-item-label></q-item-section
                >
              </q-item>

              <q-item
                clickable
                v-close-popup
                @click="updateStatus('pending')"
                class="text-warning"
              >
                <q-item-section side
                  ><q-icon name="pending" size="xs" color="warning"
                /></q-item-section>
                <q-item-section
                  ><q-item-label>Pending</q-item-label></q-item-section
                >
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-chip
            class="glossy"
            size="sm"
            clickable
            removable
            @remove="removeTag(i, value?.id, logItemData?.id)"
            v-for="(value, i) in logItemData?.tags || []"
            :style="{ backgroundColor: value.color }"
            :key="i"
            :label="value.name"
          >
            <q-tooltip>{{ value.name }}</q-tooltip>
          </q-chip>

          <q-chip
            color="grey-8"
            size="sm"
            clickable
            icon="tag"
            label="Add Tags"
          >
            <q-menu style="min-width: 250px" @show="loadTags">
              <div class="q-pa-sm">
                <q-input
                  :style="{ backgroundColor: color }"
                  dense
                  filled
                  type="text"
                  @update:model-value="(val) => filterTags(val as string)"
                  v-model="newTag"
                  label="New Tag"
                >
                  <template #append>
                    <q-btn
                      dense
                      flat
                      round
                      color="primary"
                      icon="add"
                      @click="saveTags"
                    >
                      <q-tooltip>create new tag</q-tooltip>
                    </q-btn>
                  </template>
                  <template #prepend>
                    <q-btn dense flat round color="accent" icon="palette">
                      <q-menu>
                        <q-color v-model="color" inline class="my-picker" />
                      </q-menu>
                    </q-btn>
                  </template>
                </q-input>
                <q-separator spaced class="q-my-md" />
                <q-list v-if="tags && tags.length > 0">
                  <q-item
                    v-for="(tag, index) in tags"
                    :key="index"
                    clickable
                    v-close-popup
                    @click="addTag(tag)"
                  >
                    <q-item-section>{{ tag.name }}</q-item-section>
                    <q-item-section side>
                      <q-icon name="circle" :style="{ color: tag.color }" />
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="text-center text-grey-6 q-pa-sm">
                  No tags found
                </div>
              </div>
            </q-menu>
          </q-chip>
        </div>

        <div class="row q-gutter-x-xs">
          <q-btn
            flat
            round
            color="primary"
            icon="psychology"
            size="sm"
            @click="addInsights = true"
          >
            <q-tooltip>Add Insights</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>

  <q-dialog full-height @hide="save" v-model="addInsights">
    <q-card class="bg-grey-10" style="width: 100%; max-width: 700px">
      <form
        autocorrect="on"
        autocapitalize="on"
        autocomplete="on"
        spellcheck="true"
      >
        <q-editor
          toolbar-bg="black"
          toolbar-text-color="white"
          toolbar-rounded
          class="bg-transparent"
          autocorrect="on"
          autocapitalize="on"
          :toolbar="toolbar"
          content-style="outline: none;"
          ref="editorRef"
          content-class=" text-subtitle1 text-white"
          v-model="insights"
          min-height="300px"
        />
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { LogItemData, Tag, useAppStore } from "../store/app";
import { QEditor, useQuasar } from "quasar";

const props = defineProps<{ logItemData: LogItemData }>();
const appStore = useAppStore();
const editDetails = ref(false);
const addInsights = ref(false);
const template = `<div class="insight-prompt"  font-size: 0.95em; line-height: 1.5; margin-top: 1.2em; padding-left: 0.3em;">
  <p style="margin: 0 0 0.6em; font-weight: 500;">Add insights (optional but valuable):</p>
  <ul style="margin: 0; padding-left: 1.2em; list-style-type: '• ';">
    <li>What surprised me today?</li>
    <li>What kept me stuck—or set me free?</li>
    <li>What did I avoid, and why?</li>
    <li>What small win am I overlooking?</li>
    <li>What would I tell myself yesterday?</li>
  </ul>
</div>`;
const insights = ref(props.logItemData?.sights || template);
const detailsRef = ref<HTMLElement | null>(null);
const newTag = ref("");
const tags = ref<Tag[]>([]);
const color = ref("#ff00d4");

function saveTags() {
  if (!newTag.value) return;
  const tagToAdd: Tag = { color: color.value, name: newTag.value };
  tags.value.push(tagToAdd);
  appStore.addTag({
    color: color.value,
    name: newTag.value,
    log_id: props.logItemData?.id,
  });

  if (props.logItemData?.tags == null) {
    props.logItemData.tags = [];
  }
  props.logItemData.tags.push(tagToAdd);
  emit("updateItem", props.logItemData);

  newTag.value = "";
}

const allTags = ref<Tag[]>([]);
async function loadTags() {
  try {
    const res = await appStore.getTags();
    allTags.value = res || [];
    tags.value = [...allTags.value];
  } catch (error) {
    console.error("Error loading tags:", error);
  }
}

function filterTags(input: string | null) {
  if (!allTags.value) return;
  const search = (input || "").toLowerCase();
  tags.value = allTags.value.filter((tag) =>
    tag.name.toLowerCase().includes(search),
  );
}

function addTag(tag: Tag) {
  appStore.attachTag(tag.id!, props.logItemData?.id!);
  if (props.logItemData?.tags == null) {
    props.logItemData.tags = [];
  }
  props.logItemData.tags.push(tag);
  emit("updateItem", props.logItemData);
}

function removeTag(index: number, tagId?: number, logId?: number) {
  props.logItemData?.tags?.splice(index, 1);
  appStore.removeTag(tagId, logId);
  emit("updateItem", props.logItemData);
}

const emit = defineEmits<{ updateItem: [LogItemData] }>();
function getStatusStyles(): { icon: string; color: string; label: string } {
  const status = props.logItemData?.status;
  if (status === "completed") {
    return { icon: "check", color: "positive", label: "completed" };
  } else if (status === "failed") {
    return { icon: "close", color: "negative", label: "failed" };
  } else {
    return { icon: "pending", color: "warning", label: "pending" };
  }
}
const updatedItem = ref<LogItemData>();
async function updateStatus(newStatus: string) {
  if (!props.logItemData) return;
  updatedItem.value = { ...props.logItemData, status: newStatus };
  addInsights.value = true;
  emit("updateItem", updatedItem.value);
}
const $q = useQuasar();
const toolbar = [
  [
    {
      label: $q.lang.editor.align,
      icon: $q.iconSet.editor.align,
      fixedLabel: true,
      options: ["left", "center", "right", "justify"],
    },
  ],
  ["bold", "italic", "strike", "underline", "subscript", "superscript"],
  ["hr"],
  [
    {
      label: $q.lang.editor.formatting,
      icon: $q.iconSet.editor.formatting,
      list: "no-icons",
      options: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "code"],
    },

    "removeFormat",
  ],
  ["quote", "unordered", "ordered", "outdent", "indent"],

  ["undo", "redo"],
];

const bodyToolbar = [
  ["bold", "italic", "strike", "underline", "subscript", "superscript"],
  ["hr"],
  ["quote", "unordered", "ordered", "outdent", "indent"],

  ["undo", "redo"],
];
function save() {
  if (updatedItem.value == undefined) {
    return;
  }

  if (insights.value.length < 20) {
    $q.notify({
      type: "error",
      message:
        "failed to update status insights are empty or less than 20 characters  ",
    });
    return;
  }

  emit("updateItem", updatedItem.value);
}

const editorRef = ref<QEditor>();

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.getContentEl().addEventListener("focus", () => {});
  }
});
async function toggleEdit() {
  if (editDetails.value) {
    // Saving
    if (detailsRef.value && props.logItemData) {
      const newDetails = detailsRef.value.innerText;
      if (newDetails !== props.logItemData.details) {
        const updatedItem = { ...props.logItemData, details: newDetails };
        await appStore.saveLogItem(updatedItem);
      }
    }
  }
  editDetails.value = !editDetails.value;
}
</script>

<style scoped>
.px-sm {
  padding-left: 8px;
  padding-right: 8px;
}
</style>

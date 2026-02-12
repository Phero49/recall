<template>
    <div class="q-mb-md">
        <q-card flat class="glass-card smart-border modern-shadow">
            <q-card-section class="q-pb-none">
                <div class="row justify-between items-start no-wrap">
                    <div class="col-grow">
                        <q-editor content-class="text-subtitle1" style="border-radius: 10px;" :readonly="!editDetails"
                            :toolbar="!editDetails ? [] : bodyToolbar" v-if="logItemData?.details"
                            v-model="logItemData.details" min-height="3rem" flat />

                        <!-- <div ref="detailsRef" class="text-body1 text-grey-2" :contenteditable="editDetails"
                            :class="{ 'editing-mode': editDetails, 'text-strike text-grey-6': logItemData?.status === 'completed' }"
                            style="outline: none; min-height: 24px; width: 100%; border-radius: 4px; padding: 4px;">
                            {{ logItemData?.details }}
                        </div> -->
                    </div>

                    <q-btn dense round color="primary" :icon="editDetails ? 'check' : 'edit_note'" size="sm" flat
                        class="q-ml-sm" @click="toggleEdit" />
                </div>
            </q-card-section>

            <q-card-section class="row justify-between items-center q-pt-md">
                <div class="row q-gutter-x-sm items-center">
                    <q-chip outline size="sm" :color="getStatusStyles().color" class="status-chip">
                        <q-icon :name="getStatusStyles().icon" size="16px" class="q-mr-xs" />
                        <span class="text-weight-bold">{{ getStatusStyles().label }}</span>
                    </q-chip>

                    <q-btn-dropdown flat label="Update Status" size="sm" color="grey-5" no-caps dense
                        class="status-dropdown">
                        <q-list class="smart-border">
                            <q-item clickable v-close-popup @click="updateStatus('completed')" class="text-positive">
                                <q-item-section side><q-icon name="check" size="xs" color="positive" /></q-item-section>
                                <q-item-section><q-item-label>Done</q-item-label></q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup @click="updateStatus('failed')" class="text-negative">
                                <q-item-section side><q-icon name="close" size="xs" color="negative" /></q-item-section>
                                <q-item-section><q-item-label>Failed</q-item-label></q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup @click="updateStatus('pending')" class="text-warning">
                                <q-item-section side><q-icon name="pending" size="xs"
                                        color="warning" /></q-item-section>
                                <q-item-section><q-item-label>Pending</q-item-label></q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                </div>

                <div class="row q-gutter-x-xs">
                    <q-btn flat round color="primary" icon="psychology" size="sm" @click="addInsights = true">
                        <q-tooltip>Add Insights</q-tooltip>
                    </q-btn>
                </div>
            </q-card-section>
        </q-card>
    </div>

    <q-dialog full-height @hide="save" v-model="addInsights">
        <q-card class="bg-grey-10 " style="width: 100%;max-width: 700px;">


            <q-editor toolbar-bg="black" toolbar-text-color="white" toolbar-rounded class="bg-transparent"
                :toolbar="toolbar" content-style="outline: none;" ref="editorRef"
                content-class=" text-subtitle1 text-white" v-model="insights" min-height="300px" />
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { LogItemData, useAppStore } from '../store/app';
import { QEditor, useQuasar } from 'quasar';

const props = defineProps<{ logItemData?: LogItemData }>()
const appStore = useAppStore();
const editDetails = ref(false);
const addInsights = ref(false)
const template = `<div class="insight-prompt"  font-size: 0.95em; line-height: 1.5; margin-top: 1.2em; padding-left: 0.3em;">
  <p style="margin: 0 0 0.6em; font-weight: 500;">Add insights (optional but valuable):</p>
  <ul style="margin: 0; padding-left: 1.2em; list-style-type: '• ';">
    <li>What surprised me today?</li>
    <li>What kept me stuck—or set me free?</li>
    <li>What did I avoid, and why?</li>
    <li>What small win am I overlooking?</li>
    <li>What would I tell myself yesterday?</li>
  </ul>
</div>`
const insights = ref(props.logItemData?.sights || template)
const detailsRef = ref<HTMLElement | null>(null);
const emit = defineEmits<{ updateItem: [LogItemData] }>()
function getStatusStyles(): { icon: string, color: string, label: string } {
    const status = props.logItemData?.status;
    if (status === 'completed') {
        return { icon: 'check', color: 'positive', label: 'completed' }
    } else if (status === 'failed') {
        return { icon: 'close', color: 'negative', label: 'failed' }
    } else {
        return { icon: 'pending', color: 'warning', label: 'pending' }
    }
}
const updatedItem = ref<LogItemData>()
async function updateStatus(newStatus: string) {
    if (!props.logItemData) return;
    updatedItem.value = { ...props.logItemData, status: newStatus };
    addInsights.value = true;
    emit('updateItem', updatedItem.value)

} const $q = useQuasar()
const toolbar = [
    [

        {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            options: ['left', 'center', 'right', 'justify']
        }
    ],
    ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
    ['hr'],
    [
        {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
                'p',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'code'
            ]
        },


        'removeFormat'
    ],
    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

    ['undo', 'redo'],
]

const bodyToolbar = [
    ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
    ['hr'],
    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

    ['undo', 'redo'],
]
function save() {

    if (updatedItem.value == undefined) {
        return
    }

    if (insights.value.length < 20) {
        $q.notify({ type: 'error', message: "failed to update status insights are empty or less than 20 characters  " })
        return
    }

    emit('updateItem', updatedItem.value)

}

const editorRef = ref<QEditor>()

onMounted(() => {
    if (editorRef.value) {
        editorRef.value.getContentEl().addEventListener('focus', () => {

        })
    }
})
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
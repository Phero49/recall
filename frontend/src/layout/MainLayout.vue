<template>
    <q-layout view="hHh LpR fFf" class="bg-dark-page">
        <q-header class="bg-dark text-white border-b smart-border">
            <q-toolbar class="q-px-md" style="height: 64px;">
                <q-btn flat dense round icon="menu" class="text-grey-4" @click="leftDrawerOpen = !leftDrawerOpen" />

                <q-toolbar-title class="text-weight-bold text-gradient text-h5 q-ml-sm">
                    recall
                </q-toolbar-title>

                <q-space />

                <div class="row items-center q-gutter-md">
                    <q-input v-model="text" dense outlined standout dark class="search-input" placeholder="Search..."
                        color="primary">
                        <template #prepend>
                            <q-icon name="search" size="sm" color="grey-5" />
                        </template>
                    </q-input>

                    <!-- <q-btn unelevated color="primary" round icon="add" class="modern-shadow" @click="addNewItem = true">
                        <q-tooltip>Create New Log</q-tooltip>
                    </q-btn> -->
                </div>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above class="bg-dark sidebar-glass" :width="300">
            <q-scroll-area class="fit q-pa-sm">
                <div class="q-mb-md">
                    <q-tabs v-model="appStore.tab" dense no-caps inline-label class="tabs-modern" active-color="primary"
                        indicator-color="transparent">
                        <q-tab name="past" icon="history" label="Past" />
                        <q-tab name="upcoming" icon="event" label="Upcoming" />
                    </q-tabs>
                </div>

                <div class="q-px-sm text-overline text-grey-6 q-mb-xs">Your Logs</div>
                <logo-list />

            </q-scroll-area>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>

    <q-dialog v-model="addNewItem" persistent transition-show="scale" transition-hide="scale">
        <q-card class="glass-card smart-border" style="max-width: 500px; width: 100%;">
            <q-card-section class="row justify-between items-center q-pb-none">
                <div class="text-h6 text-gradient">Create New LogEntry</div>
                <q-btn flat dense round icon="close" color="grey-5" v-close-popup />
            </q-card-section>

            <q-card-section class="q-gutter-y-md q-pt-lg">
                <q-input v-model="title" dark outlined label="Log Title" color="primary" />
                <q-input v-model="description" dark outlined type="textarea" label="Description" color="primary" />
                <q-input v-model="scheduledDate" readonly dark outlined label="Scheduled Date">
                    <template #append>
                        <q-btn flat round color="primary" icon="calendar_today">
                            <q-menu>
                                <q-date v-model="date" color="primary" minimal />
                            </q-menu>
                        </q-btn>
                    </template>
                </q-input>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md">
                <q-btn flat label="Cancel" color="grey-6" v-close-popup no-caps />
                <q-btn unelevated label="Create" color="primary" rounded padding="xs lg" @click="appStore.addLog({
                    description: description,
                    name: title,
                    scheduledDate: scheduledDate
                })" v-close-popup no-caps />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAppStore } from '../store/app'
import LogoList from '../components/LogoList.vue'

const $q = useQuasar()
const appStore = useAppStore()

onMounted(() => {
    appStore.fetchLogs()
})
const leftDrawerOpen = ref(false)
const text = ref('')
const addNewItem = ref(false)
const title = ref('')
const description = ref('')
const scheduledDate = ref(new Date().toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
}))

const date = ref(new Date())
watch(date, () => {
    scheduledDate.value = new Date(date.value).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
})
//format as day month name year
const toggleDarkMode = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
/* Gradient header for vibrant look */
</style>
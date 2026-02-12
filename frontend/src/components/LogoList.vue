<template>
    <div class="q-mt-sm">
        <q-list padding class="q-gutter-y-xs">
            <q-item v-for="value in logList" :key="value.id" clickable v-ripple
                :active="appStore.activeLog?.id === value.id" active-class="active-log-item" class="log-item-card"
                @click="appStore.activeLog = value">
                <q-item-section avatar>
                    <q-avatar size="32px" color="primary" text-color="white" icon="event" />
                </q-item-section>

                <q-item-section>
                    <q-item-label class="text-weight-bold text-capitalize">{{ new
                        Date(value.createdAt!).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }) }}</q-item-label>
                    <q-item-label caption class="text-grey-5"> {{ getWeekdayAndRelativeTime(new
                        Date(value.createdAt!)).weekday }} | {{
                            getWeekdayAndRelativeTime(new
                                Date(value.createdAt!)).relativeTime }} </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-chip class="text-weight-bold" size="sm" square color="accent" :label="value.itemCount || 0">
                        <q-tooltip>
                            Log entry count
                        </q-tooltip>
                    </q-chip>
                </q-item-section>
            </q-item>
        </q-list>
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useAppStore } from '../store/app';
import { matCalendarToday } from '@quasar/extras/material-icons'
import { getWeekdayAndRelativeTime } from '../utils/utils';

const appStore = useAppStore()
appStore.fetchLogs()
const getLogs = () => {
    if (appStore.tab == 'past') {
        return appStore.logList?.filter((v) => {
            const date = new Date(v.createdAt!).getTime()
            return date <= Date.now()
        })
    } else {

        //sort by ascending order
        const today = new Date().toISOString().split('T')[0]; // e.g. "2026-02-11"

        return appStore.logList?.filter((v) => {
            return v.createdAt && v.createdAt >= today;
        }).sort((a, b) => {
            return a.createdAt!.localeCompare(b.createdAt!); // ascending: oldest first
        });
    }
}
const logList = computed(getLogs)
watch(() => appStore.tab, getLogs)
</script>

<style scoped></style>
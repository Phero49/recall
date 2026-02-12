<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from '../store/app';

const appStore = useAppStore();

onMounted(() => {
    appStore.fetchAnalytics();
});
</script>

<template>
    <div class="q-pa-md analytics-panel">
        <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
                <q-card flat class="glass-card smart-border full-height">
                    <q-card-section>
                        <div class="text-overline text-grey-5 lowercase">Completion Rate</div>
                        <div class="row items-center justify-between">
                            <div class="text-h4 text-bold text-gradient">
                                {{ appStore.analytics?.completion_rate.toFixed(1) }}%
                            </div>
                            <q-circular-progress show-value font-size="12px"
                                :value="appStore.analytics?.completion_rate" size="50px" :thickness="0.22"
                                color="primary" track-color="grey-9" class="q-ma-md" />
                        </div>
                    </q-card-section>
                </q-card>
            </div>

            <div class="col-12 col-sm-6">
                <q-card flat class="glass-card smart-border full-height">
                    <q-card-section>
                        <div class="text-overline text-grey-5 lowercase">Daily Streak</div>
                        <div class="row items-center q-gutter-x-md">
                            <div class="text-h4 text-bold text-gradient">
                                {{ appStore.analytics?.streak }}
                            </div>
                            <q-icon name="local_fire_department" color="orange" size="md" />
                        </div>
                        <div class="text-caption text-grey-5">Consecutive days of logging</div>
                    </q-card-section>
                </q-card>
            </div>

            <div class="col-12">
                <q-card flat class="glass-card smart-border">
                    <q-card-section>
                        <div class="text-overline text-grey-5 lowercase q-mb-sm">Engagement Volume</div>
                        <div class="row q-col-gutter-sm">
                            <div class="col-4">
                                <div class="bg-dark/50 q-pa-sm rounded-borders text-center">
                                    <div class="text-h6">{{ appStore.analytics?.total_tasks }}</div>
                                    <div class="text-caption text-grey-5">Tasks</div>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="bg-dark/50 q-pa-sm rounded-borders text-center border-l border-white/5">
                                    <div class="text-h6">{{ appStore.analytics?.total_notes }}</div>
                                    <div class="text-caption text-grey-5">Notes</div>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="bg-dark/50 q-pa-sm rounded-borders text-center border-l border-white/5">
                                    <div class="text-h6">{{ appStore.analytics?.total_ideas }}</div>
                                    <div class="text-caption text-grey-5">Ideas</div>
                                </div>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </div>

            <div class="col-12">
                <q-card flat class="glass-card smart-border">
                    <q-card-section>
                        <div class="text-overline text-grey-5 lowercase q-mb-xs">Review Depth</div>
                        <div class="row items-center justify-between">
                            <div>
                                <div class="text-h5 text-weight-medium">{{ appStore.analytics?.insight_count }}</div>
                                <div class="text-caption text-grey-5">Substantial insights captured</div>
                            </div>
                            <q-icon name="psychology" color="primary" size="lg" />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>
</template>

<style scoped>
.analytics-panel {
    max-width: 600px;
    margin: 0 auto;
}

.lowercase {
    text-transform: lowercase;
}
</style>

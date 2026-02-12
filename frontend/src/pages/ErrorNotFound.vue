<script lang="ts" setup>
//
</script>

<template>
    <q-page class="flex flex-center">
        <div class="text-center">
            <q-icon name="error_outline" size="100px" color="negative" />
            <div class="text-h2 q-mt-md">404</div>
            <div class="text-h5 q-mb-md">Oops. Nothing here...</div>
            <q-btn flat color="primary" label="Go Home" to="/" icon="home" />
        </div>
    </q-page>
</template>

<style scoped>
.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
</style>

<script setup>
import Header from "./components/Header.vue";
import { useMessageModalStore } from "@/stores/messageModal";

const messageModal = useMessageModalStore();
</script>

<template>
  <div class="app-background">
    <Header />
    <router-view />
    <b-modal v-model="messageModal.state.isShow" ok-only>
      {{ messageModal.state.message }}
    </b-modal>
  </div>
</template>

<style>
.app-background {
  background-color: #f9f9f9;
}
</style>

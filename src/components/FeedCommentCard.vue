<script setup>
import ProfileImg from "./ProfileImg.vue";
import { useAuthenticationStore } from "@/stores/authentication";

const authenticationStore = useAuthenticationStore();

const props = defineProps({
  item: Object,
});
</script>

<template>
  <div class="cmtItemCont">
    <div
      class="cmtItemProfile"
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div
        style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px"
      >
        <profile-img
          :clsValue="'profile pointer'"
          :size="30"
          :pic="props.item.writerPic"
          :userId="props.item.writerUserId"
        />
        <div style="font-weight: bold">
          {{
            props.item.writerNickName
              ? props.item.writerNickName
              : props.item.writerUid
          }}
        </div>
      </div>
      <template
        v-if="
          authenticationStore.state.signedUser.userId ===
          props.item.writerUserId
        "
      >
        <i
          class="fa fa-trash pointer"
          style="margin-right: 20px"
          @click="$emit('onDeleteComment')"
        ></i>
      </template>
    </div>
    <div class="cmtItemCtnt">
      <div>{{ props.item.comment }}</div>
    </div>
  </div>
</template>

<style scoped>
.cmtItemCtnt {
  margin-bottom: 20px;
}
</style>

<script setup>
import { reactive, onMounted } from "vue";
import FeedCard from "@/components/FeedCard.vue";
import { getLikedFeeds } from "@/services/LikeListService";

const state = reactive({
  list: [],
  isLoading: false,
  isFinish: false,
});

const data = {
  startIdx: 0,
  size: 20,
};

const getData = async () => {
  if (state.isFinish || state.isLoading) return;

  state.isLoading = true;
  const res = await getLikedFeeds(data.startIdx, data.size);
  if (res.status === 200) {
    const result = res.data.result;
    if (result && result.length > 0) {
      result.forEach((item) => {
        item.isLike = true;
      });

      state.list.push(...result);
      data.startIdx += result.length;
    }
    if (result.length < data.size) {
      state.isFinish = true;
    }
  }
  state.isLoading = false;
};
onMounted(() => {
  getData();
});
</script>

<template>
  <section class="back_color">
    <div class="container d-flex flex-column align-items-center">
      <feed-card
        v-for="item in state.list"
        :key="item.feedId || item.id"
        :item="item"
      />
      <p v-if="state.isLoading">Loading...</p>
      <p v-if="state.isFinish && state.list.length === 0">
        좋아요한 게시물이 없습니다.
      </p>
    </div>
  </section>
</template>

<style scoped>
.back_color {
  background-color: #fafafa;
}
</style>

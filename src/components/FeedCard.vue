<script setup>
import ProfileImg from "./ProfileImg.vue";
import FeedCommentContainer from "./FeedCommentContainer.vue";
import { useAuthenticationStore } from "@/stores/authentication";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { ref, reactive } from "vue";
import { getDateTimeInfo } from "@/utils/feedUtils";
import { toggleFeedLike } from "@/services/feedLikeService";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const baseUrl = ref(import.meta.env.VITE_BASE_URL);

const authenticationStore = useAuthenticationStore();

const props = defineProps({
  item: {
    feedId: Number,
    writerUserId: Number,
    writerPic: String,
    writerNm: String,
    location: String,
    pics: Array,
    contents: String,
    isLike: Boolean,
    likeCount: Number,
    comment: Object,
  },
  ynDel: Boolean,
  onDeleteFeed: Function,
});

const state = reactive({
  modules: [Navigation, Pagination, Scrollbar, A11y],
  isLike: props.item.isLike,
  pagination: props.item.pics.length <= 5 ? { clickable: true } : null,
  likeCount: props.item.likeCount,
});

const toggleLike = async () => {
  console.log("toggleLike click!");
  const data = { feedId: props.item.feedId };
  const res = await toggleFeedLike(data);

  if (res.status === 200) {
    state.isLike = !state.isLike;
    state.likeCount += state.isLike ? 1 : -1;
  }
};

// const deleteFeed = async () => {
//   if(!ynDel || !confirm('삭제하시겠습니까?')) { return; }

//   const params = {
//     feed_id: props.item.feedId
//   }

//   const res = await deleteFeed(params);
//   if(res.status === 200) {

//   }

// }
</script>

<template>
  <div class="item mt-5 mb-3 p-3 w400">
    <div class="d-flex flex-row ps-3 pe-3">
      <div class="d-flex flex-column justify-content-center">
        <router-link :to="`/profile/${props.item.writerUserId}`">
          <profile-img
            :userId="props.item.writerUserId"
            :pic="props.item.writerPic"
            :size="30"
            :clsValue="'pointer profile'"
          />
        </router-link>
      </div>
      <div class="p-3 flex-grow-1">
        <div>
          <router-link :to="`/profile/${props.item.writerUserId}`">
            <span class="pointer"
              >{{
                props.item.writerNickName
                  ? props.item.writerNickName
                  : props.item.writerUid
              }}
              - {{ getDateTimeInfo(props.item.createdAt) }}</span
            >
          </router-link>
        </div>
        <div>{{ props.item.location }}</div>
      </div>
      <div
        v-if="
          props.ynDel &&
          props.item.writerUserId ===
            authenticationStore.state.signedUser.userId
        "
      >
        <div className="d-flex flex-column justify-content-center">
          <i
            className="fa fa-trash pointer color-red"
            @click="$emit('onDeleteFeed')"
          ></i>
        </div>
      </div>
    </div>

    <swiper
      navigation
      :modules="state.modules"
      :pagination="{ clickable: true, dynamicBullets: true }"
      :scrollbar="{ draggable: true }"
      :slides-per-view="1"
      :space-between="50"
    >
      <swiper-slide
        v-for="(item, idx) in props.item.pics"
        :virtualIndex="idx"
        :key="idx"
      >
        <img
          :src="`${baseUrl}/pic/feed/${props.item.feedId}/${item}`"
          :alt="`이미지`"
          :aria-label="`이미지`"
          class="w614"
        />
      </swiper-slide>
    </swiper>

    <div class="favCont p-2 d-flex flex-row align-items-center">
      <i
        :class="`${
          state.isLike ? 'fas' : 'far'
        } fa-heart pointer rem1_2 me-3 color-red`"
        @click="toggleLike"
      ></i>
      <span class="like-text ms-2">
        <strong>{{ state.likeCount.toLocaleString() }}</strong>
        {{ state.likeCount === 1 ? "like" : "likes" }}
      </span>
    </div>

    <feed-comment-container
      :feed-id="props.item.feedId"
      :comments="props.item.comments"
    />
  </div>
</template>

<style scoped>
/* 메인 카드 컨테이너 */
.item {
  border: none;
  width: 614px;
  max-width: 100%;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.item:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* 헤더 스타일링 */
.item .d-flex.flex-row.ps-3.pe-3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: none;
}

/* 프로필 이미지 컨테이너 */
.profile {
  border-radius: 50%;
  border: 2px solid transparent;
  background: linear-gradient(45deg, #ff6b6b, #d77fa1, #9b59b6) padding-box,
    linear-gradient(45deg, #ff6b6b, #d77fa1, #9b59b6) border-box;
  transition: transform 0.3s ease;
}

.profile:hover {
  transform: scale(1.1);
}

/* 사용자 정보 */
.item .p-3.flex-grow-1 {
  padding: 0 16px !important;
}

.item .p-3.flex-grow-1 > div:first-child {
  margin-bottom: 4px;
}

.item .p-3.flex-grow-1 a {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.3s ease;
}

.item .p-3.flex-grow-1 a:hover {
  color: #3498db;
}

.item .p-3.flex-grow-1 > div:last-child {
  color: #7f8c8d;
  font-size: 12px;
  margin-top: 2px;
}

/* 삭제 버튼 */
.fa-trash {
  font-size: 18px;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  background: rgba(231, 76, 60, 0.1);
}

.fa-trash:hover {
  background: rgba(231, 76, 60, 0.2);
  transform: scale(1.1);
}

/* 이미지 슬라이더 */
.item :deep(.swiper) {
  border-radius: 0;
  margin: 0;
  background: #f8f9fa;
}

.w614 {
  width: 100% !important;
  height: 400px;
  object-fit: cover;
  display: block;
}

/* Swiper 커스터마이징 */
.item :deep(.swiper-pagination) {
  bottom: 12px !important;
}

.item :deep(.swiper-pagination-bullet) {
  background: rgba(255, 255, 255, 0.7) !important;
  opacity: 1 !important;
  width: 8px !important;
  height: 8px !important;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.item :deep(.swiper-pagination-bullet-active) {
  background: #ffffff !important;
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.item :deep(.swiper-button-next),
.item :deep(.swiper-button-prev) {
  color: rgba(255, 255, 255, 0.8) !important;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  width: 36px !important;
  height: 36px !important;
  margin-top: -18px !important;
  transition: all 0.3s ease;
}

.item :deep(.swiper-button-next):hover,
.item :deep(.swiper-button-prev):hover {
  background: rgba(0, 0, 0, 0.6);
  transform: scale(1.1);
}

.item :deep(.swiper-button-next:after),
.item :deep(.swiper-button-prev:after) {
  font-size: 14px !important;
  font-weight: 600;
}

/* 좋아요 섹션 */
.favCont {
  background: #ffffff;
  border-bottom: 1px solid #000;
  padding: 12px 16px !important;
  margin-bottom: 20px;
}

.fa-heart {
  font-size: 20px !important;
  transition: all 0.3s ease;
  color: #e74c3c !important;
}

.fa-heart:hover {
  transform: scale(1.2);
}

.fas.fa-heart {
  color: #e74c3c !important;
  filter: drop-shadow(0 2px 4px rgba(231, 76, 60, 0.3));
}

.far.fa-heart {
  color: #95a5a6 !important;
}

.far.fa-heart:hover {
  color: #e74c3c !important;
}

.like-text {
  font-size: 14px;
  color: #2c3e50;
}

.like-text strong {
  font-weight: 600;
}

/* 컨텐츠 */
.itemCtnt {
  background: #ffffff;
  padding: 16px !important;
  color: #2c3e50;
  font-size: 14px;
  line-height: 1.5;
  margin-top: -20px;
}

/* 공통 유틸리티 */
.pointer {
  cursor: pointer;
}

.color-red {
  color: #e74c3c !important;
}

.rem1_2 {
  font-size: 1.2rem;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .item {
    width: 100%;
    border-radius: 8px;
    margin: 0 8px 16px 8px;
  }

  .w614 {
    height: 300px;
  }

  .item .d-flex.flex-row.ps-3.pe-3 {
    padding: 12px !important;
  }

  .favCont {
    padding: 8px 12px !important;
  }

  .itemCtnt {
    padding: 12px !important;
  }
}

@media (max-width: 480px) {
  .w614 {
    height: 250px;
  }

  .item {
    margin: 0 4px 12px 4px;
  }
}

/* 애니메이션 */
@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.fas.fa-heart:active {
  animation: heartBeat 0.3s ease;
}

/* 호버 효과 개선 */
.item .p-3.flex-grow-1 a span {
  position: relative;
  transition: all 0.3s ease;
}

.item .p-3.flex-grow-1 a span::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background: linear-gradient(45deg, #3498db, #9b59b6);
  transition: width 0.3s ease;
}

.item .p-3.flex-grow-1 a:hover span::after {
  width: 100%;
}
</style>

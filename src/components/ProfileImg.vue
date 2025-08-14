<script setup>
import { ref } from "vue";
import defaultProfileImg from "@/assets/defaultProfileImg.png";

const baseUrl = ref(import.meta.env.VITE_BASE_URL);

const props = defineProps({
  userId: Number,
  clsValue: String,
  size: Number,
  pic: String,
});

console.log(
  "profileImg - props:",
  `${baseUrl.value}/pic/profile/${props.userId}/${props.pic}`
);

const pic = props.pic
  ? `${baseUrl.value}/pic/profile/${props.userId}/${props.pic}`
  : defaultProfileImg;

const handleImgError = (e) => {
  e.target.src = defaultProfileImg;
  e.target.onError = null;
};

const getFollowStateText = (state) => {
  console.Console.log(`state : ${state}`);
  switch (state) {
    case 0:
      return "팔로우";
    case 3:
      return "팔로우 취소";
    case 2:
      return "맞팔로우";
  }
};

/*
0: 서로 팔로우 안 한 상태
1: 나만 상대방을 팔로우 한 상태
2: 상대방만 나를 팔로우 한 상태
3: 서로 팔로우 한 상태
*/

/*
onMounted()
}
const res = await getUserProfile(params);
});
*/

const removeUserPic = () => {
  console.log("프로파일 이미지 삭제");
};
</script>

<template>
  <div
    class="circleimg"
    :class="`${props.clsValue} w${props.size} h${props.size}`"
  >
    <img :src="pic" @error="handleImgError" />
  </div>
</template>

<style scoped>
.w24 {
  width: 24px;
}
.w30 {
  width: 30px;
}
.w100 {
  width: 100px;
}
.w250 {
  width: 250px;
}
.w300 {
  width: 300px;
}

.w800 {
  width: 800px;
}

.circleimg {
  display: inline-block;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid #ecf0f1;
  vertical-align: top;
}
.circleimg > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

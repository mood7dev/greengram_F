<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { useAuthenticationStore } from "@/stores/authentication";
import FeedCard from "@/components/FeedCard.vue";
import { getFeedList, postFeed } from "@/services/feedService";
import { bindEvent } from "@/utils/commonUtils";
import "bootstrap-icons/font/bootstrap-icons.css";

const modalCloseButton = ref(null);

const authenticationStore = useAuthenticationStore();

const state = reactive({
  list: [],
  isLoading: false,
  isFinish: false,
  feed: {
    location: "",
    contents: "",
    pics: [],
  },
});

const data = {
  page: 1,
  rowPerPage: 20,
};

const handleScroll = () => {
  bindEvent(state, window, getData);
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  getData();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const getCurrentTimestamp = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);

  const hours = ("0" + today.getHours()).slice(-2);
  const minutes = ("0" + today.getMinutes()).slice(-2);
  const seconds = ("0" + today.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const getData = async () => {
  state.isLoading = true;
  const params = {
    page: data.page++,
    row_per_page: data.rowPerPage,
  };
  const res = await getFeedList(params);
  if (res.status === 200) {
    const result = res.data.result;
    if (result && result.length > 0) {
      state.list = [...state.list, ...result];
    }
    if (result.length < data.rowPerPage) {
      state.isFinish = true;
    }
  }
  state.isLoading = false;
};

const handlePicChanged = (e) => {
  state.feed.pics = e.target.files;
};

const saveFeed = async () => {
  console.log("state.feed.pics: ", state.feed.pics);
  const MAX_PIC_COUNT = 10;
  //사진 있는지 확인
  if (state.feed.pics.length === 0) {
    alert("사진을 선택해 주세요.");
    return;
  } else if (state.feed.pics.length > MAX_PIC_COUNT) {
    alert(`사진은 ${MAX_PIC_COUNT}장까지 선택 가능합니다.`);
    return;
  }

  const params = {
    contents: state.feed.contents.length === 0 ? null : state.feed.contents,
    location: state.feed.location.length === 0 ? null : state.feed.location,
  };

  const formData = new FormData();
  formData.append(
    "req",
    new Blob([JSON.stringify(params)], { type: "application/json" })
  );
  for (let i = 0; i < state.feed.pics.length; i++) {
    formData.append("pic", state.feed.pics[i]);
  }

  // formData.append('pic', state.feed.pics[0])
  // formData.append('pic', state.feed.pics[1])
  // formData.append('pic', state.feed.pics[2])

  const res = await postFeed(formData);
  if (res.status === 200) {
    const result = res.data.result;

    const item = {
      ...params,
      feedId: result.feedId,
      pics: result.pics,
      writerId: authenticationStore.state.signedUser.userId,
      writerNm: authenticationStore.state.signedUser.nickName,
      writerPic: authenticationStore.state.signedUser.pic,
      createdAt: getCurrentTimestamp(),
      comment: {
        moreComment: false,
        commentList: [],
      },
    };

    state.list.unshift(item);
    initInputs();
    modalCloseButton.value.click(); //모달창 닫기
  }
};

const initInputs = () => {
  state.feed.contents = "";
  state.feed.location = "";
  state.feed.pics = [];
};
</script>

<template>
  <section class="back_color">
    <div class="container d-flex flex-column align-items-center mt-5">
      <feed-card
        v-for="item in state.list"
        :key="item.id"
        :item="item"
      ></feed-card>
      <p v-if="state.isLoading">Loading...</p>
    </div>
  </section>

  <!-- 심플한 모달 -->
  <div
    class="modal fade"
    id="newFeedModal"
    tabIndex="-1"
    aria-labelledby="newFeedModalLabel"
    aria-hidden="false"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content simple-modal">
        <div class="modal-header">
          <h5 class="modal-title">새 게시물</h5>
          <button
            type="button"
            class="close-btn"
            data-bs-dismiss="modal"
            aria-label="Close"
            ref="modalCloseButton"
          >
            ×
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <input
              type="text"
              class="form-input"
              placeholder="위치를 입력하세요"
              v-model="state.feed.location"
            />
          </div>

          <div class="form-group">
            <textarea
              class="form-textarea"
              placeholder="무슨 일이 일어나고 있나요?"
              v-model="state.feed.contents"
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="file-upload-label">
              <input
                type="file"
                multiple
                accept="image/*"
                @change="handlePicChanged"
                class="file-input"
              />
              <span class="file-upload-text"
                ><i class="bi bi-camera-fill"></i> 사진 선택</span
              >
            </label>
          </div>

          <div class="selected-files" v-if="state.feed.pics.length > 0">
            선택된 파일: {{ state.feed.pics.length }}개
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" data-bs-dismiss="modal">
            취소
          </button>
          <button type="button" class="btn-submit" @click="saveFeed">
            게시하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.back_color {
  background-color: #fafafa;
}

/* 모달 스타일 */
.simple-modal {
  border-radius: 16px;
  border: none;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 40px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #f8f9fa;
  color: #333;
}

.modal-body {
  padding: 16px 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #007bff;
}

.file-upload-label {
  display: inline-block;
  padding: 12px 20px;
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: center;
}

.file-upload-label:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.file-input {
  display: none;
}

.file-upload-text {
  color: #666;
  font-size: 16px;
  display: block;
  text-align: center;
}

.selected-files {
  color: #007bff;
  font-size: 14px;
  margin-top: 8px;
}

.modal-footer {
  padding: 16px 24px 24px;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 10px 20px;
  border: 2px solid #fff;
  background-color: #6c757d;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

.btn-submit {
  padding: 10px 20px;
  border: none;
  background-color: #333;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-submit:hover {
  background-color: #000;
}

.btn-submit:disabled {
  background-color: #dee2e6;
  cursor: not-allowed;
}
</style>

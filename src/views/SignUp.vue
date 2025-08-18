<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { signUp } from "@/services/userService";
import { checkValidation } from "@/utils/validation";

const fileInput = ref(null);

const router = useRouter();

const state = reactive({
  data: {
    nickName: "홍길동",
    uid: "mic2",
    upw: "aaaa1212!!",
    chkUpw: "aaaa1212!!",
    pic: null,
    roles: [],
  },
});

const openFileSelector = (e) => {
  fileInput.value.click();
};

const handlePicChanged = (e) => {
  state.data.pic = e.target.files[0];
};

const submit = async () => {
  //유효성 체크
  if (checkValidation()) {
    return;
  }

  //비밀번호, 확인 비밀번호 체크
  if (state.data.chkUpw !== state.data.upw) {
    alert("비밀번호와 확인 비밀번호가 일치하지 않습니다.");
    return;
  }

  //역할 체크
  if (state.data.roles.length === 0) {
    alert("역할을 선택해 주세요.");
    return;
  }

  const params = {
    uid: state.data.uid.trim(),
    upw: state.data.upw.trim(),
    roles: state.data.roles,
  };
  if (state.data.nickName.trim().length > 0) {
    //닉네임에 무엇인가 적혀있다면 params에 추가
    params.nickName = state.data.nickName.trim();
  }

  const formData = new FormData();
  formData.append(
    "req",
    new Blob([JSON.stringify(params)], { type: "application/json" })
  );
  if (state.data.pic) {
    formData.append("pic", state.data.pic);
  }

  const res = await signUp(formData);
  console.log("res:", res);
  if (res.status === 200) {
    alert("회원가입을 축하합니다.");
    await router.push("/sign-in");
  }
};
</script>

<template>
  <div class="signup-wrapper">
    <div class="signup-container">
      <!-- 헤더 영역 -->
      <div class="header-section">
        <h1 class="app-title">회원가입</h1>
        <p class="app-subtitle">새로운 계정을 만들어보세요</p>
      </div>

      <!-- 폼 영역 -->
      <div class="form-section">
        <form class="signup-form" @submit.prevent="submit">
          <div class="form-floating">
            <input
              type="text"
              class="form-control"
              id="uid"
              placeholder="아이디"
              v-model="state.data.uid"
              not-null-message="아이디는 필수로 입력하셔야 합니다."
              regexp="^[A-Za-z0-9_]{4,50}$"
              regexp-message="아이디는 영어, 숫자, 언더바로만 구성되어야 하며 4~50자까지 작성할 수 있습니다."
              :class="{ 'has-value': state.data.uid }"
            />
            <label for="uid" class="form-label">아이디</label>
          </div>

          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="upw"
              placeholder="비밀번호"
              v-model="state.data.upw"
              not-null-message="비밀번호는 필수로 입력하셔야 합니다."
              regexp="^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&amp;*()_+\-=\[\]{};':&quot;\\|,.&lt;&gt;\/?])[A-Za-z\d!@#$%^&amp;*()_+\-=\[\]{};':&quot;\\|,.&lt;&gt;\/?]{10,}$"
              regexp-message="비밀번호는 영문자, 숫자, 특수기호로 구성되며 10자 이상이어야 합니다."
              autocomplete="off"
              :class="{ 'has-value': state.data.upw }"
            />
            <label for="upw" class="form-label">비밀번호</label>
          </div>

          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="chkUpw"
              placeholder="비밀번호 확인"
              v-model="state.data.chkUpw"
              autocomplete="off"
              :class="{ 'has-value': state.data.chkUpw }"
            />
            <label for="chkUpw" class="form-label">비밀번호 확인</label>
          </div>

          <div class="form-floating">
            <input
              type="text"
              class="form-control"
              id="nickName"
              placeholder="닉네임"
              v-model="state.data.nickName"
              regexp="^[가-힣]{2,10}$"
              regexp-message="닉네임은 한글로 2~10자까지 가능합니다."
              :class="{ 'has-value': state.data.nickName }"
            />
            <label for="nickName" class="form-label">닉네임</label>
          </div>

          <div class="select-group">
            <label class="select-label">역할 선택</label>
            <select class="form-select" v-model="state.data.roles" multiple>
              <option value="유저1">유저1</option>
              <option value="유저2">유저2</option>
              <option value="관리자">관리자</option>
              <option value="멘토">멘토</option>
              <option value="매니저">매니저</option>
            </select>
          </div>

          <div class="file-group">
            <label class="file-label">프로필 사진</label>
            <div class="file-input-container">
              <button type="button" class="file-btn" @click="openFileSelector">
                파일 선택
              </button>
              <input
                ref="fileInput"
                hidden
                id="pic"
                type="file"
                accept="image/*"
                @change="handlePicChanged"
              />
              <span class="file-name" v-if="state.data.pic">{{
                state.data.pic.name
              }}</span>
              <span class="file-placeholder" v-else>선택된 파일 없음</span>
            </div>
          </div>

          <button class="signup-btn" type="submit">회원가입</button>

          <div class="signin-link">
            <router-link to="/sign-in">
              <span>이미 계정이 있으신가요? 로그인하기</span>
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signup-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.signup-container {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.signup-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
}

/* 헤더 영역 */
.header-section {
  background: linear-gradient(
    135deg,
    #000000 0%,
    #2f2f2f 30%,
    #6e6e6e 60%,
    #a9a9a9 80%,
    #dcdcdc 100%
  );
  padding: 40px 30px 35px;
  text-align: center;
  color: white;
  position: relative;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.app-title {
  font-style: italic;
  font-size: 2.2rem;
  font-weight: 200;
  margin: 0 0 10px 0;
  letter-spacing: 2px;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
}

.app-subtitle {
  font-size: 0.95rem;
  opacity: 0.9;
  font-weight: 300;
  margin: 0;
  letter-spacing: 0.5px;
}

/* 폼 영역 */
.form-section {
  padding: 35px 30px 30px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-floating {
  position: relative;
}

.form-control {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 15px;
  background: white;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
}

.form-control:focus {
  border-color: #333;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
}

.form-control:focus + .form-label,
.form-control:not(:placeholder-shown) + .form-label {
  transform: translateY(-14px) scale(0.85);
  padding: 0 4px;
  display: inline-block;
  color: #333;
  font-weight: 500;
  line-height: 1.1;
}

.form-label {
  position: absolute;
  top: 14px;
  left: 5px;
  color: #999;
  font-size: 15px;
  transition: all 0.3s ease;
  pointer-events: none;
  transform-origin: left center;
}

.select-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.select-label,
.file-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.form-select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 15px;
  background: white;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  min-height: 90px;
}

.form-select:focus {
  border-color: #333;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
}

.form-select option {
  padding: 8px;
  font-size: 14px;
}

.file-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  transition: all 0.3s ease;
}

.file-input-container:hover {
  border-color: #ccc;
}

.file-btn {
  padding: 8px 16px;
  background: #000;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.file-btn:hover {
  background: #333;
  transform: translateY(-1px);
}

.file-name,
.file-placeholder {
  font-size: 14px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-name {
  color: #333;
  font-weight: 500;
}

.file-placeholder {
  color: #999;
}

.signup-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.signup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #111111 0%, #444444 100%);
}

.signup-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.signin-link {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.signin-link a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  transition: color 0.3s ease;
}

.signin-link a:hover {
  color: #333;
  text-decoration: underline;
}

/* 모바일 대응 */
@media (max-width: 480px) {
  .signup-wrapper {
    padding: 10px;
  }

  .signup-container {
    max-width: 100%;
    border-radius: 12px;
  }

  .header-section {
    padding: 30px 25px 25px;
  }

  .app-title {
    font-size: 1.9rem;
  }

  .app-subtitle {
    font-size: 0.9rem;
  }

  .form-section {
    padding: 25px 20px 25px;
  }

  .signup-form {
    gap: 16px;
  }

  .form-control,
  .form-select {
    padding: 12px 14px;
    font-size: 14px;
  }

  .file-input-container {
    padding: 12px 14px;
  }

  .signup-btn {
    padding: 14px;
    font-size: 15px;
  }
}
</style>

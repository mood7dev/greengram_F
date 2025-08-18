<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { signIn } from "@/services/userService";
import { useAuthenticationStore } from "@/stores/authentication";
import { checkValidation } from "@/utils/validation";

const router = useRouter();

const authentication = useAuthenticationStore();

const state = reactive({
  form: {
    uid: "mic2",
    upw: "aaaa1212!!",
  },
});

const submit = async () => {
  //유효성 체크
  if (checkValidation()) {
    return;
  }

  const res = await signIn(state.form);
  console.log("Login.vue - submit() - res: ", res);
  if (res.status === 200) {
    const signedUser = res.data.result;
    console.log("signedUser:", signedUser);
    authentication.setSignedUser(signedUser);
    await router.push("/");
  }
};
</script>

<template>
  <div class="login-wrapper">
    <div class="polaroid-stack">
      <!-- 배경 폴라로이드들 -->
      <div class="polaroid-bg polaroid-1"></div>
      <div class="polaroid-bg polaroid-2"></div>

      <!-- 메인 폴라로이드 카드 -->
      <div class="main-polaroid">
        <!-- 폴라로이드 사진 영역 -->
        <div class="polaroid-photo">
          <div class="photo-content">
            <div class="logo-area">
              <div class="app-icon">📷</div>
              <h1 class="app-title">𝑺𝒉𝒂𝒑#𝑮𝒓𝒂𝒎</h1>
            </div>
          </div>
        </div>

        <!-- 폴라로이드 하단 흰 부분 -->
        <div class="polaroid-bottom">
          <form class="login-form" @submit.prevent="submit">
            <div class="input-group">
              <input
                type="text"
                class="form-input"
                id="uid"
                placeholder="아이디"
                v-model="state.form.uid"
                not-null-message="아이디는 필수로 입력하셔야 합니다."
                regexp="^[A-Za-z0-9_]{4,50}$"
                regexp-message="아이디는 영어, 숫자, 언더바로만 구성되어야 하며 4~50자까지 작성할 수 있습니다."
              />
            </div>
            <div class="input-group">
              <input
                type="password"
                class="form-input"
                id="upw"
                placeholder="비밀번호"
                v-model="state.form.upw"
                autocomplete="off"
                not-null-message="비밀번호는 필수로 입력하셔야 합니다."
                regexp="^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&amp;*()_+\-=\[\]{};':&quot;\\|,.&lt;&gt;\/?])[A-Za-z\d!@#$%^&amp;*()_+\-=\[\]{};':&quot;\\|,.&lt;&gt;\/?]{10,}$"
                regexp-message="비밀번호는 영문자, 숫자, 특수기호로 구성되며 10자 이상이어야 합니다."
              />
            </div>
            <button class="login-btn" type="submit">로그인</button>

            <div class="signup-link">
              <router-link to="/sign-up">
                <span>계정이 없으신가요? 가입하기</span>
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  min-height: 80vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.polaroid-stack {
  position: relative;
  width: 320px;
  height: 480px;
}

/* 배경 폴라로이드들 */
.polaroid-bg {
  position: absolute;
  width: 300px;
  height: 360px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  opacity: 0.8;
}

.polaroid-1 {
  top: -15px;
  left: -10px;
  transform: rotate(-8deg);
  z-index: 1;
}

.polaroid-2 {
  top: 10px;
  right: -15px;
  transform: rotate(5deg);
  z-index: 2;
}

/* 메인 폴라로이드 카드 */
.main-polaroid {
  position: relative;
  z-index: 10;
  width: 320px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  transform: rotate(-2deg);
  transition: all 0.4s ease;
  overflow: hidden;
}

.main-polaroid:hover {
  transform: rotate(0deg) scale(1.02);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

/* 폴라로이드 사진 부분 */
.polaroid-photo {
  width: 100%;
  height: 320px;
  background: linear-gradient(
    135deg,
    #000000 0%,
    #2f2f2f 30%,
    #6e6e6e 60%,
    #a9a9a9 80%,
    #dcdcdc 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 10px;
}

.photo-content {
  text-align: center;
  color: white;
}

.app-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  animation: float 4s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

.app-title {
  font-style: italic;
  font-size: 35px;
  margin: 0;
  letter-spacing: 3px;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
}

/* 폴라로이드 하단 흰 부분 */
.polaroid-bottom {
  padding: 30px 25px 25px;
  background: #ffffff;
  min-height: 160px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 6px;
  font-size: 14px;
  background: #fafafa;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #999;
  font-weight: 400;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #000000 0%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2); /* 은은한 실버 하이라이트 그림자 */
  margin-top: 8px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 220, 220, 0.6), 0 4px 8px rgba(0, 0, 0, 0.7);
  background: linear-gradient(135deg, #111111 0%, #555555 50%, #9a9a9a 100%);
}

.login-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
  background: linear-gradient(135deg, #000000 0%, #2a2a2a 50%, #585858 100%);
}

.signup-link {
  text-align: center;
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.signup-link a {
  color: #667eea;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.signup-link a:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 손글씨 느낌의 폰트 효과 */
.polaroid-bottom::before {
  content: "";
  position: absolute;
  bottom: 8px;
  right: 15px;
  width: 80px;
  height: 1px;
  background: #ddd;
}

.polaroid-bottom::after {
  content: "";
  position: absolute;
  bottom: 6px;
  right: 20px;
  font-size: 10px;
  color: #ccc;
}

/* 모바일 대응 */
@media (max-width: 480px) {
  .polaroid-stack {
    width: 290px;
    height: 450px;
  }

  .main-polaroid {
    width: 290px;
  }

  .polaroid-bg {
    width: 270px;
    height: 330px;
  }

  .polaroid-photo {
    height: 290px;
  }

  .app-icon {
    font-size: 4rem;
  }

  .app-title {
    font-size: 2rem;
  }

  .polaroid-bottom {
    padding: 25px 20px 20px;
  }
}
</style>

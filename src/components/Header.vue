<script setup>
import logo from "@/assets/logo.png";
import ProfileImg from "./ProfileImg.vue";
import { useAuthenticationStore } from "@/stores/authentication";
import { signOut } from "@/services/userService";

const authenticationStore = useAuthenticationStore();

const doSignOut = async () => {
  const res = await signOut();
  if (res.status === 200) {
    await authenticationStore.signOut();
  }
};
</script>

<template>
  <header class="instagram-header" v-if="authenticationStore.state.isSigned">
    <div class="header-container">
      <div class="header-content">
        <!-- 로고 섹션 -->
        <div class="logo-section">
          <router-link to="/" class="logo-link">
            <img :src="logo" class="logo-img" alt="Instagram" />
          </router-link>
        </div>

        <!-- 검색바 섹션 -->
        <div class="search-section">
          <!-- 검색 기능이 필요한 경우 여기에 추가 -->
        </div>

        <!-- 네비게이션 섹션 -->
        <div class="nav-section">
          <nav class="nav-container">
            <!-- 홈 -->
            <div class="nav-item">
              <router-link to="/" class="nav-link" title="홈">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="nav-icon"
                >
                  <path
                    d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"
                    stroke="currentColor"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
              </router-link>
            </div>

            <!-- 새 게시물 -->
            <div class="nav-item">
              <a
                href="#"
                id="newFeedModalBtn"
                data-bs-toggle="modal"
                data-bs-target="#newFeedModal"
                class="nav-link"
                title="새로운 게시물"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="nav-icon"
                >
                  <path
                    d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <line
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    x1="6.545"
                    x2="17.455"
                    y1="12.001"
                    y2="12.001"
                  />
                  <line
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    x1="12.003"
                    x2="12.003"
                    y1="6.545"
                    y2="17.455"
                  />
                </svg>
              </a>
            </div>

            <!-- 활동 -->
            <div class="nav-item">
              <a href="#" class="nav-link" title="활동">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="nav-icon"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </div>

            <!-- 메시지 -->
            <div class="nav-item">
              <a href="#" class="nav-link" title="메시지">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="nav-icon"
                >
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </div>

            <!-- 프로필 드롭다운 -->
            <div class="nav-item dropdown">
              <a
                href="#"
                role="button"
                id="navDropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                class="profile-link"
                title="프로필"
              >
                <profile-img
                  :userId="authenticationStore.state.signedUser.userId"
                  :pic="authenticationStore.state.signedUser.pic"
                  :size="30"
                  :clsValue="'profile-image'"
                />
              </a>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="navDropdownMenuLink"
              >
                <li>
                  <router-link
                    :to="`/profile/${authenticationStore.state.signedUser.userId}`"
                    class="dropdown-item-link"
                  >
                    <span class="dropdown-item">
                      <span class="dropdown-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                          <circle
                            cx="12.004"
                            cy="12.004"
                            fill="none"
                            r="10.5"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-miterlimit="10"
                            stroke-width="2"
                          />
                          <path
                            d="M18.793 20.014a6.08 6.08 0 00-1.778-2.447 3.991 3.991 0 00-2.386-.791H9.38a3.994 3.994 0 00-2.386.791 6.09 6.09 0 00-1.779 2.447"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-miterlimit="10"
                            stroke-width="2"
                          />
                          <circle
                            cx="12.006"
                            cy="9.718"
                            fill="none"
                            r="4.109"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-miterlimit="10"
                            stroke-width="2"
                          />
                        </svg>
                      </span>
                      <span class="dropdown-text">프로필</span>
                    </span>
                  </router-link>
                </li>
                <li>
                  <a href="#" class="dropdown-item-link">
                    <span class="dropdown-item">
                      <span class="dropdown-icon">
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="currentColor"
                            stroke-width="2"
                            fill="none"
                          />
                          <path
                            d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"
                            stroke="currentColor"
                            stroke-width="2"
                          />
                        </svg>
                      </span>
                      <span class="dropdown-text">설정</span>
                    </span>
                  </a>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <span class="dropdown-item signout-item" @click="doSignOut">
                    <span class="dropdown-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path
                          d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          fill="none"
                        />
                      </svg>
                    </span>
                    <span class="dropdown-text">로그아웃</span>
                  </span>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.instagram-header {
  background-color: #ffffff;
  border-bottom: 1px solid #dbdbdb;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.header-container {
  max-width: 935px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

/* 로고 섹션 */
.logo-section {
  flex: 0 0 auto;
  min-width: 127px;
}

.logo-link {
  display: inline-block;
  text-decoration: none;
}

.logo-img {
  height: 29px;
  width: auto;
  object-fit: contain;
  vertical-align: middle;
}

/* 검색 섹션 */
.search-section {
  flex: 1;
  display: flex;
  justify-content: center;
}

/* 네비게이션 섹션 */
.nav-section {
  flex: 0 0 auto;
  min-width: 244px;
  display: flex;
  justify-content: flex-end;
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 22px;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #9b59b6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #9b59b6;
  transform: scale(1.1);
}

.nav-icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
}

/* 프로필 링크 */
.profile-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.profile-link:hover {
  transform: scale(1.1);
}

.profile-image {
  border-radius: 50%;
  border: 1px solid #dbdbdb;
  cursor: pointer;
}

/* 활성 상태 */
.router-link-active .nav-icon {
  stroke: #9b59b6;
  fill: #9b59b6;
}

/* 드롭다운 메뉴 */
.dropdown-menu {
  background: #ffffff;
  border: 1px solid #dbdbdb;
  border-radius: 6px;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.0975);
  padding: 8px 0;
  margin-top: 12px;
  min-width: 230px;
}

.dropdown-menu::before {
  content: "";
  position: absolute;
  top: -6px;
  right: 28px;
  width: 14px;
  height: 14px;
  background: #ffffff;
  border: 1px solid #dbdbdb;
  border-bottom: none;
  border-right: none;
  transform: rotate(45deg);
}

.dropdown-item-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #9b59b6;
  font-size: 14px;
  font-weight: 400;
}

.dropdown-item:hover {
  background-color: #fafafa;
}

.signout-item {
  color: #9b59b6;
}

.signout-item:hover {
  background-color: #fafafa;
}

.dropdown-icon {
  display: flex;
  align-items: center;
  margin-right: 12px;
  color: inherit;
}

.dropdown-text {
  font-size: 14px;
  font-weight: 400;
  color: inherit;
}

.dropdown-divider {
  margin: 6px 0;
  border-color: #efefef;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }

  .header-content {
    height: 54px;
  }

  .search-section {
    display: none;
  }

  .nav-container {
    gap: 20px;
  }

  .logo-img {
    height: 24px;
  }

  .nav-icon {
    width: 22px;
    height: 22px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    gap: 16px;
  }

  .logo-section {
    min-width: auto;
  }

  .nav-section {
    min-width: auto;
  }
}

/* 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-menu {
  animation: fadeIn 0.15s ease;
}
</style>

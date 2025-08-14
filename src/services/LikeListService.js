import axios from "./httpRequester";

const path = "/feed/likeList";

export const getLikedFeeds = (startIdx = 0, size = 10) => {
  return axios
    .get(`${path}?startIdx=${startIdx}&size=${size}`)
    .catch((e) => e.response);
};

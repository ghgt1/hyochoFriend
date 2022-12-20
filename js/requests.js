import { alertModal } from "./main.js";
import { setItemWithExpireTime, showErrorBox } from "./signup.js";
import { signupEl, loginEl, loginModalEl, userInfoEl } from "./store.js";

const API_KEY = `FcKdtJs202209`;
const USER_NAME = `imyeji`;

// ========== 인증 관련 api ==========
// 회원가입 api
export async function signup(email, password, displayName) {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/signup",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
      },
      body: JSON.stringify({
        email: email,
        password: password,
        displayName: displayName,
      }),
    }
  );
  if (!res.ok) {
    showErrorBox(signupEl.emailOverlapError);
    return;
  }
  location.reload();
}

// 로그인 api
export async function login(email, password) {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/login",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }
  );
  if (res.ok) {
    const json = await res.json();
    // locaStorage에 24시간 만료시간을 설정하고 데이터 저장
    setItemWithExpireTime("token", json.accessToken, 86400000);
    location.reload();
  } else {
    showErrorBox(loginEl.loginErrorBox);
  }
}

// 로그아웃 api
export async function logout() {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/logout",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  localStorage.removeItem("token");
  location.href = "/";
  loginModalEl.loginBtnEl.textContent = "로그인/가입";
}

// 인증 확인 api
export async function authLogin() {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  if (token) {
    const res = await fetch(
      "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/me",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey: API_KEY,
          username: USER_NAME,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const json = await res.json();
    // 로그인할 때 회원정보에 이름 들어가도록 만들기
    userInfoEl.userInfoName.value = json.displayName;
    return json.email;
  }
}

// 사용자 정보 수정 api
export async function editUser(content, displayName, oldPassword, newPassword) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/user",
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        displayName,
        oldPassword,
        newPassword,
      }),
    }
  );
  if (res.ok) {
    alertModal(`${content} 변경이 완료되었습니다.`);
  } else {
    alertModal(`${content}가 일치하지 않습니다.`);
  }
}

// ========== 관리자 api ==========
export async function addItem({
  name,
  price,
  description,
  tag,
  thumbnail,
  img,
}) {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/products",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        masterKey: "true",
      },
      body: JSON.stringify({
        title: name,
        price: Number(price),
        description: description,
        tags: [tag],
        thumbnailBase64: thumbnail,
        photoBase64: img,
      }),
    }
  );
  const json = await res.json();
  console.log("Response:", json);
}

// 상품 정보 갖고오기
export async function getItem() {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/products",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        masterKey: "true",
      },
    }
  );
  const json = await res.json();
  // console.log("Response:", json);
  return json;
}

// 상품 삭제 api
export async function deleteItem(id) {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/${id}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        masterKey: "true",
      },
    }
  );
  const json = await res.json();
  console.log("Response:", json);
}

// 상품 상세 정보 api
export async function getDetailItem(id) {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/${id}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
      },
    }
  );
  const json = await res.json();
  console.log("Response:", json);
  return json;
}

// 전체 거래내역 api
export async function getAllPurchases() {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/transactions/all `,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        masterKey: "true",
      },
    }
  );
  const json = await res.json();
  console.log("Response:", json);
}

// 상품 상태변경 api
export async function editItemStatus(id, sold = true) {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/${id}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        masterKey: "true",
      },
      body: JSON.stringify({
        isSoldOut: sold,
      }),
    }
  );
  const json = await res.json();
  console.log("Response:", json);
}

// 상품 검색 api
export async function searchItem(name) {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/search`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        masterKey: "true",
      },
      body: JSON.stringify({
        searchText: name,
      }),
    }
  );
  const json = await res.json();
  console.log("Response:", json);
  return json;
}

// 계좌관련 api

export async function addAccount(code, accN, phoneN, sign) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/account",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bankCode: code,
        accountNumber: accN,
        phoneNumber: phoneN,
        signature: sign,
      }),
    }
  );
  const json = await res.json();
  console.log(json);
  if (!res.ok) {
    alertModal(`${json}`);
  } else {
    alertModal("계좌가 연결되었습니다.");
  }
}

export async function getAccounts() {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/account",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await res.json();
  console.log(json);
  return json.accounts;
}

export async function removeAccount(accId, sign) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/account",
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        accountId: accId, // 계좌 ID (필수!)
        signature: sign, // 사용자 서명 (필수!)
      }),
    }
  );
  const json = await res.json();
  console.log(json);
  if (!res.ok) {
    alertModal(`${json}`);
  } else {
    alertModal("삭제되었습니다.");
  }
}

//QnA API
export async function getQnA() {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos?apikey=FcKdtJs202209&username=KDT3-Tanaka",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "KDT3_Tanaka",
      },
    }
  );
  const json = await res.json();
  return json;
}

export async function postQna(title) {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "KDT3_Tanaka",
      },
      body: JSON.stringify({
        title,
      }),
    }
  );
  const json = await res.json();
  return json;
}

export async function deleteQna(id) {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos" +
      `/${id}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "KDT3_Tanaka",
      },
    }
  );
  const json = await res.json();
  return json;
}

// 구매 관련 api
export async function purchaseItems(accountId, productId) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/buy`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: productId,
        accountId: accountId,
      }),
    }
  );
  const json = await res.json();
  console.log("Response:", json);
  return json;
}

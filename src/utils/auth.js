// auth授权模块

const TokenKey = 'auth-token';
const corpCodeKey = 'corp-code';

// 从缓存中同步获取 token
export function getToken() {
  try {
    const token = uni.getStorageSync(TokenKey);
    return token;
  } catch (err) {
    console.error("fail to get token:", err);
    return null;
  }
}

// 设置token在缓存中
export function setToken(token) {
	// 使用uni-app的setStorage方法代替sessionStorage.setItem
	uni.setStorage({
		key: TokenKey,
		data: token,
	});
}

// 从缓存中删除token
export function removeToken() {
	// 使用uni-app的removeStorage方法代替sessionStorage.removeItem
	uni.removeStorage({
		key: TokenKey,
	});
}

// 从缓存中获取企业码
export function getCorpCode() {
 try {
    const corpCode = uni.getStorageSync(corpCodeKey);
    return corpCode;
  } catch (err) {
    console.error("fail to get CorpCode:", err);
    return null;
  }
}

// 设置企业码在缓存中
export function setCorpCode(corpCode) {
	// 取消CorpCode在30天后自动过期，直接使用uni-app的setStorage方法代替Cookies.set
	uni.setStorage({
		key: corpCodeKey,
		data: corpCode,
	});
	console.log(`成功设置企业码${corpCode}`)
}
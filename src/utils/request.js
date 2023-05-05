import { getToken, getCorpCode } from './auth.js';
export const baseUrl = 'https://gloryest.com/api/';

// 请求拦截器
function requestInterceptor(config) {
  // 如果 URL 不以 'http' 开头，则设置请求的基本 URL
  if (!config.url.startsWith('http')) {
    config.url = baseUrl + config.url;
  }

  // 设置请求方法为 POST 和超时时间
  config.method = 'POST';
  config.timeout = 120000; // 2 分钟

  // 设置请求头信息，包含内容类型，身份验证令牌和公司代码
  config.header = {
    'Content-Type': 'application/json',
    'auth-token': getToken(),
    'corp-code': getCorpCode(),
  };

  return config;
}

// 响应处理函数
function handleResponse(res) {
  if (res.data.status === 415 || res.data.status === 4001 || res.data.status === 500) {
		console.log("信息错误")
		return null;
  }

  return res;
}

// 自定义请求函数，使用 requestInterceptor 拦截器
export function customRequest(config) {
  // 使用 requestInterceptor 修改请求配置
  const interceptedConfig = requestInterceptor(config);

  // 返回一个新的 Promise 对象
  return new Promise((resolve, reject) => {
    // 使用 uni.request 发送请求
    uni.request({
      ...interceptedConfig,
      success: (res) => {
        const handledResponse = handleResponse(res);
        resolve(handledResponse);
      },
      fail: (err) => {
        // 根据错误信息处理不同的错误情况，例如超时或网络错误
        if (err.message.includes('timeout')) {
          // 处理请求超时错误
        } else if (err.message.includes('Network Error')) {
          // 处理网络错误
        }
        reject(err);
      },
    });
  });
}

// 发送 POST 请求
function post(apiName, params) {
  return customRequest({
    url: apiName,
    data: params,
  });
}

// 获取完整的 URL，并更新缓存
function getCompleteServerUrl(apiName, params, cacheServerList) {
  return post('frame/service/url', { name: apiName }).then((res) => {
    if (res.statusCode === 200 && res.data.status === 200) {
      if (res.data.res) {
        // 更新本地缓存
        uni.setStorageSync('serverList', [
          ...cacheServerList,
          {
            serverName: apiName,
            url: res.data.res,
          },
        ]);

        return post(res.data.res, params);
      } else {
        return Promise.resolve({ data: res.data });
      }
    } else {
      return Promise.resolve({ data: res.data });
    }
  });
}

// 服务发现的请求
export const ajaxRequest = function(apiName, params) {
    // 获取本地缓存
    let cacheServerList = uni.getStorageSync('serverList') || [];

    // 如果缓存中已有 URL，则直接发送请求
    const apiItem = cacheServerList.find(item => item.serverName === apiName);
    if (apiItem && Object.keys(apiItem).length !== 0) {
        return post(apiItem.url, params);
    } else {
        // 否则，获取完整 URL 并发送请求
        return getCompleteServerUrl(apiName, params, cacheServerList);
    }
};

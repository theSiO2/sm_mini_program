<template>
	<div class="bg">
		<image class="bg-image" src="/static/login_bg.png" mode="aspectFill"></image>
		<div class="login-box">
			<h2>智能纺纱助手</h2>
			<div class="input-wrapper">
				<u-icon name="home-fill" size="30px"></u-icon>
				<u-input v-model="companyCode" placeholder="请输入企业码" border="bottom" clearable></u-input>
			</div>
			<div class="input-wrapper">
				<u-icon name="account-fill" size="30px"></u-icon>
				<u-input v-model="account" placeholder="请输入账号" border="bottom" clearable></u-input>
			</div>
			<div class="input-wrapper">
				<u-icon name="lock-opened-fill" size="30px"></u-icon>
				<u-input v-model="password" placeholder="请输入密码" :password="true" border="bottom" clearable></u-input>
			</div>
			<div class="input-wrapper">
				<u-checkbox-group class="remember-password">
					<u-checkbox v-model="rememberPassword" label="记住密码" name="记住密码" labelColor="#f3f3f3">
					</u-checkbox>
				</u-checkbox-group>
			</div>
			<u-button class="login-button" @click="login">登录</u-button>
		</div>
	</div>
</template>
<script>
	import {
		customRequest,
		ajaxRequest
	} from "@/src/utils/request.js"
	import {
		setCorpCode,
		getCorpCode,
		setToken,
		getToken
	} from "@/src/utils/auth.js"
	export default {
		name: "index",
		data() {
			return {
				companyCode: "", //企业码
				account: "", //账户
				password: "", //密码
				rememberPassword: false //是否记住密码 
			};
		},
		onLoad() {
			// 检查本地存储中是否有用户名和密码，如果有，直接填充到输入框
			const savedUsername = uni.getStorageSync("username");
			const savedPassword = uni.getStorageSync("password");
			this.companyCode = getCorpCode();
			if (savedUsername && savedPassword) {
				this.username = savedUsername;
				this.password = savedPassword;
				this.rememberPassword = true;
			}
		},
		methods: {
			login() {
				// 记住密码
				if (this.rememberPassword) {
					uni.setStorageSync("username", this.username);
					uni.setStorageSync("password", this.password);
					setCorpCode(this.companyCode);
				} else {
					uni.removeStorageSync("username");
					uni.removeStorageSync("password");
				}
				const params = {
					loginName: this.account,
					password: this.password
				};
				ajaxRequest("frame.user.login", params)
					.then(
						(response) => {
							console.log(response.data.res),
								setToken(response.data.res),
								// 跳转到主界面
								console.log("跳转"),
								uni.navigateTo({
									url: "../../pages/index/index",
								})
						}

					)
					.catch();
			}
		}
	};
</script>

<style scoped>
	.bg {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: relative;
	}

	.bg-image {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: -1;
	}

	.login-box {
		height: 300px;
		width: 300px;
		background-color: aliceblue;
		margin-bottom: 200px;
		background-color: rgba(255, 255, 255, 0.5);
		border-radius: 10px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.4);
	}

	h2 {
		font-weight: 600;
		color: #333;
		margin-bottom: 20px;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		width: 100%;
		margin-bottom: 10px;
	}

	u--input {
		flex-grow: 1;
		margin-left: 10px;
		border: none;
	}

	.login-button {
		width: 100%;
		font-size: 18px;
		font-weight: 600;
		color: #fff;
		background-color: #3c8dbc;
		padding: 10px;
		borderradius: 5px;
		cursor: pointer;
		border: none;
	}

	.login-button:hover {
		background-color: #31708f;
		border: none;
	}

	.remember-password {
		display: flex;
		justify-content: flex-end;
		width: 100%;
	}
</style>
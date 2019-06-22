<template>
  <div class="loginForm">
    <div class="login_box">
      <!-- 头像区s -->
      <div class="login_avatar">
        <img src="../assets/logo.png" alt>
      </div>
      <!-- 头像区e -->
      <!-- 表单区s -->
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-button type="info" @click="loginInfo_reset">重置</el-button>
          <el-button type="primary" @click="loginInfo_login">登录</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单区e -->
    </div>
  </div>
</template>

<script>
import { log } from "util";
import { ok } from "assert";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    // 发送登录验证请求
    loginInfo_login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          var { data: res } = await this.axios.post("login", this.loginForm);
          console.log(res);
          if (res.meta.status == 200) {
            // console.log("ok");
            sessionStorage.setItem("token", res.data.token);
            this.$router.push("/home");
            this.$message({
              message: "恭喜你，登录成功",
              type: "success"
            });
          } else {
            console.log(res.meta.msg);
            this.$message.error("错了哦，错误");
          }
        }
      });
    },
    // 登录信息重置
    loginInfo_reset() {
      this.$refs.loginFormRef.resetFields();
    }
  },

  created() {}
};
</script>

<style lang='less' scoped>
.loginForm {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  margin: 0 auto;
  border-radius: 10px;
}
.el-button {
  float: right;
  margin-right: 15px;
}
.login_avatar {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  padding: 10px;
  border-radius: 50%;
  border: 1px solid #000;
  box-shadow: 0 0 10px skyblue;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.el-form {
  position: absolute;
  top: 90px;
  width: 400px;
  margin-left: 25px;
}
</style>

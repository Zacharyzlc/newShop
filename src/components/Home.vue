<template>
  <div>
    Home 组件
    <el-button type="info" @click="exitHome">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  methods: {
    exitHome() {
      this.$router.push("/login");
      sessionStorage.removeItem("token");
    }
  },

  created() {}
};
</script>

<style lang='less' scoped>
.el-button {
  float: right;
  margin-right: 15px;
}
</style>

<template>
  <el-container>
    <!-- 头部s -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt>
        <span>XXX网站后台管理系统</span>
      </div>
      <el-button type="info" @click="exitHome">退出</el-button>
    </el-header>
    <!-- 头部e -->
    <el-container>
      <!-- 侧边栏s -->
      <el-aside width="200px">
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409EFF">
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级侧边栏模板 -->
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级侧边栏 -->
            <el-menu-item :index="item2.id+''" v-for="item2 in item.children" :key="item2.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 侧边栏e -->
      <!-- 主体区域s -->
      <el-main>Main</el-main>
      <!-- 主体区域e -->
    </el-container>
  </el-container>
</template>

<script>
import { log } from 'util'
export default {
  data() {
    return {
      menuList: [],
      iconList: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      }
    }
  },

  methods: {
    // 推出后台主页
    exitHome() {
      this.$router.push('/login')
      sessionStorage.removeItem('token')
    },
    // 获取左侧主菜单
    async getAsideMenu() {
      const { data: res } = await this.axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error('数据请求失败')
      this.$message.success('数据请求成功')
      console.log(res.data)
      this.menuList = res.data
    }
  },

  created() {
    this.getAsideMenu()
  }
}
</script>

<style lang='less' scoped>
.el-button {
  margin-right: 15px;
}
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  background-color: #2b4b6b;
  justify-content: space-between;
  align-items: center;
}
.el-aside {
  height: 100%;
  background-color: #333744;
}
.el-main {
  height: 100%;
  background-color: #fff;
}
.iconfont {
  margin-right: 10px;
}
</style>

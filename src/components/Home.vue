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
      <el-aside :width="isCollapse?'64px':'200px'">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="cyan"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="defaultAction"
        >
          <div class="foldBtn" @click="toFoldBtn">|||</div>
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级侧边栏模板 -->
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级侧边栏 -->
            <el-menu-item
              :index="'/'+item2.path"
              v-for="item2 in item.children"
              :key="item2.id"
              @click="setSessionStorage('/'+item2.path)"
            >
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
      <el-main>
        <!-- 欢迎界面 -->
        <router-view></router-view>
      </el-main>
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
      },
      // 控制侧边栏是否折叠
      isCollapse: false,
      defaultAction: ''
    }
  },

  methods: {
    // 退出后台主页
    exitHome() {
      this.$router.push('/login')
      sessionStorage.removeItem('token')
    },
    // 获取左侧主菜单
    async getAsideMenu() {
      const { data: res } = await this.axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error('数据请求失败')
      this.$message.success('数据请求成功')
      // console.log(res.data)
      this.menuList = res.data
    },
    toFoldBtn() {
      this.isCollapse = !this.isCollapse
    },
    setSessionStorage(path) {
      sessionStorage.setItem('defaultAction', path)
      this.defaultAction = path
    }
  },

  created() {
    this.getAsideMenu()
    this.defaultAction = sessionStorage.getItem('defaultAction')
  }
}
</script>

<style lang='less' scoped>
.el-button {
  margin-right: 15px;
}
.el-container {
  height: 100%;
  .el-menu {
    border: 0;
  }
}
.el-header {
  display: flex;
  background-color: #2b4b6b;
  justify-content: space-between;
  align-items: center;
  vertical-align: middle;
  img {
    display: inline-block;
    vertical-align: middle;
    margin-right: 15px;
  }
  span {
    font-size: 18px;
    color: #ccc;
  }
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
.foldBtn {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #fff;
}
</style>

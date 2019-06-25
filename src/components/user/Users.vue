<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">活动管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索用户区 -->
      <el-input v-model="queryUser" icon="el-icon-search" placeholder="请输入搜索内容"></el-input>
      <el-button slot="append" icon="el-icon-search"></el-button>
      <!-- 添加用户按钮 -->
      <el-button type="primary" @click="addUserBtn">添加新用户</el-button>
      <!-- 卡片表格区域 -->
      <el-table stripe border :data="usersList" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="userStatuChange(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="mg_state" label="操作">
          <!-- 修改按钮 -->
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog"></el-button>
          <!-- 删除按钮 -->
          <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="分配角色按钮"
            :enterable="false"
            placement="bottom-end"
          >
            <el-button size="mini" type="warning" icon="el-icon-star-off" @click="showEditDialog"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <!-- 分页功能区 -->
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加新用户" :visible.sync="addUserDialogVisible" width="40%">
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存储用户数据列表
      usersList: [],
      // 用于搜索用户数据
      queryUser: '',
      // 请求信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 1
      },
      // 分页功能区
      currentPage: 1,
      total: 0,
      // 添加用户对话框的显示隐藏
      addUserDialogVisible: false,
      // 添加用户的表单数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户验证规则
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入注册邮箱', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入注册手机号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 控制修改用户信息对话框
      editDialogVisible: false
    }
  },

  methods: {
    // 请求用户数据列表 列表初始化
    async getUsersList() {
      const { data: res } = await this.axios.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('用户列表请求失败')
      // this.$message.success('用户列表请求成功')

      this.usersList = res.data.users
      this.total = res.data.total
      // console.log(res.data)
    },
    // 监听页面/条数变化
    pageSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 监听页码值变化事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    async userStatuChange(row) {
      // console.log(row)
      const { data: res } = await this.axios.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.error('用户状态更新失败')
      }
      this.$message.success('用户状态更新成功')
    },
    addUserBtn() {
      this.addUserDialogVisible = true
    },
    async addNewUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.post('users', this.addUserForm)
        console.log(res.meta)
        this.$refs.addUserFormRef.resetFields()
        this.addUserDialogVisible = false
        this.getUsersList()
      })
    },
    showEditDialog() {
      this.editDialogVisible = true
    }
  },

  created() {
    this.getUsersList()
  }
}
</script>
z
<style lang='less' scoped>
.el-card {
  margin: 15px 0;
  .el-input {
    display: inline-block;
    width: 300px;
    margin-right: 10px;
  }
}
.el-table {
  margin-top: 10px;
}
</style>

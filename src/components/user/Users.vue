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
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUserInfo(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色按钮"
              :enterable="false"
              placement="bottom-end"
            >
              <el-button size="mini" type="warning" icon="el-icon-star-off"></el-button>
            </el-tooltip>
          </template>
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
    <el-dialog
      title="修改用户信息"
      @close="editDialogVisibleClose"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        ref="editUserFormRef"
        :rules="editUserFormRules"
        :model="editUserForm"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editInfoSubmmit">确 定</el-button>
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
        pagesize: 5
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
      // 编辑用户的表单数据验证
      editUserForm: {
        username: '',
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
      editUserFormRules: {
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
      // 编辑用户信息
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
    async showEditDialog(id) {
      this.editDialogVisible = true
      // console.log(id)
      const { data: res } = await this.axios.get('users/' + id)
      console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('信息查询失败')
      this.editUserForm = res.data
    },
    editDialogVisibleClose() {
      this.$refs.editUserFormRef.resetFields()
    },
    // 修改后的信息提交按钮
    async editInfoSubmmit(editUserForm) {
      // console.log(id)
      this.$refs.editUserFormRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return
        const { data: res } = await this.axios.put(
          'users/' + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          }
        )
        if (res.meta.status !== 200)
          return this.$message.error('用户信息修改失败')
        this.$message.success('用户信息修改成功')
        this.getUsersList()
        this.editDialogVisible = false
      })
    },
    async deleteUserInfo(id) {
      const result = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (result == 'cancel') return this.$message.error('取消删除')
      this.$message.success('确认删除')
      
      const { data: res } = await this.axios.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('用户删除失败')
      this.$message.success('用户删除成功')
      this.getUsersList()
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

<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class='el-icon-arrow-right'>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 搜索和添加区域 -->
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" @keyup.enter.native="getAdminList">
                        <el-button slot="append" icon="el-icon-search" @click="getAdminList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加管理员</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe align="center">
                <el-table-column type="index" label="#" align="center"></el-table-column>
                <el-table-column label="工号" prop="teaId" align="center"></el-table-column>
                <el-table-column label="姓名" prop="teaName" align="center"></el-table-column>
                <el-table-column label="职称" prop="teaTile" align="center"></el-table-column>
                <el-table-column label="邮箱" prop="teaEmail" align="center"></el-table-column>
                <el-table-column label="电话" prop="teaTel" align="center"></el-table-column>
                <el-table-column label="密码" prop="teaPwd" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <!-- 修改 -->
                      <el-button type="primary" icon="el-icon-edit" sizi="mini" @click="showEditDialog(scope.row)"></el-button>
                      <!-- 删除 -->
                      <el-button type="danger" icon="el-icon-delete" sizi="mini" @click="removeTeacher(scope.row.teaId)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5,10,15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加教师模态框 -->
        <el-dialog title="添加教师" :visible.sync="addDialogVisible" width="25%" @close="addDialogClose">
          <!-- 内容主体区域 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="工号" prop="TeaId">
              <el-input v-model="addForm.TeaId"></el-input>
            </el-form-item>
            <el-form-item label="院系" prop="TeaDept">
              <el-input v-model="addForm.TeaDept"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="TeaName">
              <el-input v-model="addForm.TeaName"></el-input>
            </el-form-item>
            <el-form-item label="职称" prop="TeaTitle">
              <el-input v-model="addForm.TeaTitle"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="TeaSex">
                <el-radio v-model="addForm.TeaSex" label="男">男生</el-radio>
                <el-radio v-model="addForm.TeaSex" label="女">女生</el-radio>
            </el-form-item>
            <el-form-item label="邮箱" prop="TeaEmail">
              <el-input v-model="addForm.TeaEmail"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="TeaTel">
              <el-input v-model="addForm.TeaTel"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addAdmin">确定</el-button>
          </span>
        </el-dialog>

        <!-- 修改教师信息模态框 -->
        <el-dialog title="修改管理员信息" :visible.sync="editDialogVisible" width="20%">
          <el-form :model="editForm" ref="editFormRef" label-width="70px">
            <el-form-item label="工号" prop="TeaId">
              <el-input v-model="editForm.teaId" disabled/>
            </el-form-item>
            <el-form-item label="姓名" prop="TeaName">
              <el-input v-model="editForm.teaName"/>
            </el-form-item>
            <el-form-item label="职称" prop="TeaTitle">
              <el-input v-model="editForm.teaTile"/>
            </el-form-item>
            <el-form-item label="性别" prop="TeaSex">
                <el-radio v-model="editForm.teaSex" label="男">男生</el-radio>
                <el-radio v-model="editForm.teaSex" label="女">女生</el-radio>
            </el-form-item>
            <el-form-item label="邮箱" prop="TeaEmail">
              <el-input v-model="editForm.teaEmail"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="TeaTel">
              <el-input v-model="editForm.teaTel"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="TeaPwd">
              <el-input v-model="editForm.teaPwd"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="editAdmin">确认</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取教师列表
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userlist: [],
      total: 0,
      // 控制添加教师模态框的显示与隐藏
      addDialogVisible: false,
      // 添加教师表单数据
      addForm: {
        TeaId: '',
        TeaRid: '',
        TeaDept: '',
        TeaName: '',
        TeaTile: '',
        TeaSex: '',
        TeaEmail: '',
        TeaTel: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        TeaId: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          {
            min: 9,
            max: 9,
            message: '输入正确的工号(9位数字)',
            trigger: 'blur'
          }
        ],
        TeaRid: [
          { required: true, message: '请选择权限', trigger: 'blur' }
        ],
        TeaDept: [
          { required: true, message: '请输入院系代码', trigger: 'blur' }
        ],
        TeaName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        TeaTitle: [
          { required: true, message: '请输入职称', trigger: 'blur' }
        ],
        TeaSex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        TeaEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        TeaTel: [
          { required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确手机', trigger: 'blur' }
        ]
      },
      // 控制修改教师信息模态框的显示与隐藏
      editDialogVisible: false,
      // 修改教师表单数据
      editForm: {
      }
    }
  },
  created () {
    this.getAdminList()
  },
  methods: {
    async getAdminList () {
      const { data: res } = await this.$http.get('/dark/admin/admins', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userlist = res.data.objects
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
    //   console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getTeacherList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getTeacherList()
    },
    // 监听添加教师模态框的关闭事件
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加管理员框
    addAdmin () {
      console.log(this.addForm)
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('添加参数有问题')
        const { data: res } = await this.$http.post('/dark/admin/admins/add', this.qs.stringify(this.addForm))
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 隐藏添加管理员模态框
        this.addDialogVisible = false
        // 刷新管理员列表
        this.getAdminList()
      })
    },
    // 展示编辑教师信息的模态框
    showEditDialog (row) {
      this.editDialogVisible = true
      this.editForm = row
      console.log(row)
    },
    // 修改教师信息
    editAdmin () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('修改参数有问题')
        const { data: res } = await this.$http.put('/dark/admin/admins/update', this.qs.stringify(this.editForm))
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success(res.meta.msg)

        // 隐藏修改教师信息模态框
        this.editDialogVisible = false
        // 刷新教师列表
        this.getTeacherList()
      })
    },
    async removeAdmin (stuId) {
      const confirmResult = await this.$confirm('确认删除该教师？', '警告', {
        confirmButtomText: '确认',
        cancelButtomText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('/dark/admin/teachers/delete/' + stuId)

      if (res.meta.status !== 200) {
        return this.$message.error('删除失败!')
      }

      this.$message.success('删除成功!')
      this.getTeacherList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>

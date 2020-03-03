<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class='el-icon-arrow-right'>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>学生列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 搜索和添加区域 -->
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" @keyup.enter.native="getStudentList">
                        <el-button slot="append" icon="el-icon-search" @click="getStudentList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加学生</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe align="center">
                <el-table-column type="index" label="#" align="center"></el-table-column>
                <el-table-column label="学号" prop="stuId" align="center"></el-table-column>
                <el-table-column label="姓名" prop="stuName" align="center"></el-table-column>
                <el-table-column label="性别" prop="stuSex" align="center"></el-table-column>
                <el-table-column label="专业" prop="stuMajor" align="center"></el-table-column>
                <el-table-column label="年级" prop="stuGrade" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                          <el-button type="primary" icon="el-icon-edit" sizi="mini" @click="showEditDialog(scope.row)"></el-button>
                        <!-- 删除 -->
                          <el-button type="danger" icon="el-icon-delete" sizi="mini" @click="removeStudent(scope.row.stuId)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户模态框 -->
        <el-dialog title="添加学生" :visible.sync="addDialogVisible" width="25%" @close="addDialogClose">
        <!-- 内容主题区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="学号" prop="StuId">
                <el-input v-model="addForm.StuId"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="StuName">
                <el-input v-model="addForm.StuName"></el-input>
            </el-form-item>
            <el-form-item label="专业" prop="StuMajor">
                <el-input v-model="addForm.StuMajor"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="StuPwd">
                <el-input v-model="addForm.StuPwd"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="StuSex">
                <el-radio v-model="addForm.StuSex" label="男">男生</el-radio>
                <el-radio v-model="addForm.StuSex" label="女">女生</el-radio>
                <!-- <el-input v-model="addForm.StuSex"></el-input> -->
            </el-form-item>
            <el-form-item label="年级" prop="StuGrade">
                <el-input v-model="addForm.StuGrade"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStudent">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改学生信息对话框 -->
        <el-dialog title="修改学生信息" :visible.sync="editDialogVisible" width="20%">
          <!-- 内容主体 -->
          <el-form :model="editForm" ref="editFormRef" label-width="70px">
            <el-form-item label="学号" prop="StuId">
              <el-input v-model="editForm.stuId" disabled></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="StuName">
              <el-input v-model="editForm.stuName"></el-input>
            </el-form-item>
            <el-form-item label="专业" prop="StuMajor">
              <el-input v-model="editForm.stuMajor"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="StuPwd">
              <el-input v-model="editForm.stuPwd"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="StuSex">
              <el-radio v-model="editForm.stuSex" label="男">男性</el-radio>
              <el-radio v-model="editForm.stuSex" label="女">女性</el-radio>
              <!-- <el-input v-model="addForm.StuSex"></el-input> -->
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editStudent">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取学生列表
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userlist: [],
      total: 0,
      // 控制添加学生对话框的显示与隐藏
      addDialogVisible: false,
      // 添加学生表单数据
      addForm: {
        StuId: '',
        StuName: '',
        StuMajor: '',
        StuPwd: '000000',
        StuSex: '男',
        StuGrade: ''
      },
      // 控制修改学生信息对话框的显示与隐藏
      editDialogVisible: false,
      // 修改学生表单数据
      editForm: {
      },
      // 添加表单的验证规则对象
      addFormRules: {
        StuId: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          {
            min: 13,
            max: 13,
            message: '输入正确的学号(13位数字)',
            trigger: 'blur'
          }
        ],
        StuName: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '输入正确的姓名',
            trigger: 'blur'
          }
        ],
        StuMajor: [
          { required: true, message: '请选择专业', trigger: 'blur' }
        ],
        StuPwd: [
          { required: true, message: '请输入学生密码', trigger: 'blur' },
          {
            min: 6,
            max: 14,
            message: '最小6位字符，最多14位',
            trigger: 'blur'
          }
        ],
        StuGrade: [
          { required: true, message: '选择年级', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getStudentList()
  },
  methods: {
    async getStudentList () {
      const { data: res } = await this.$http.get('/dark/admin/students', {
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
      this.getStudentList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getStudentList()
    },
    // 监听添加学生对话框的关闭事件
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加学生
    addStudent () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('添加参数有问题')
        const { data: res } = await this.$http.post('/dark/admin/students/add', this.qs.stringify(this.addForm))
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 隐藏添加学生模态框
        this.addDialogVisible = false
        // 刷新学生列表
        this.getStudentList()
      })
    },
    // 展示编辑学生信息的模态框
    showEditDialog (row) {
      this.editDialogVisible = true
      this.editForm = row
    },
    // 修改学生信息
    editStudent () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('修改参数有问题')
        const { data: res } = await this.$http.put('/dark/admin/students/update', this.qs.stringify(this.editForm))
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success(res.meta.msg)

        // 隐藏修改学生信息模态框
        this.editDialogVisible = false
        // 刷新学生列表
        this.getStudentList()
      })
    },
    async removeStudent (stuId) {
      const confirmResult = await this.$confirm('确认删除该名学生？', '警告', {
        confirmButtomText: '确认',
        cancelButtomText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('/dark/admin/students/delete/' + stuId)

      if (res.meta.status !== 200) {
        return this.$message.error('删除失败!')
      }

      this.$message.success('删除成功!')
      this.getStudentList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>

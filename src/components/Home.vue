<template>
  <el-container class="home-container">
      <!-- 头部区域 -->
    <el-header>
        <div>
            <span>选课系统后台</span>
        </div>
        <el-button type="info" @click="logout">
            退出
        </el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened
        :collapse="isCollapse" :collapse-transition="false" router :default-active="$router.path">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                <!-- 一级菜单的模板区域 -->
                <template slot="title">
                    <!-- 图标 -->
                    <i :class="icon[item.id]"></i>
                    <!-- 文本 -->
                    <span>{{item.menuname}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id">
                    <!-- 二级菜单的模板区域 -->
                    <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-menu"></i>
                        <!-- 文本 -->
                        <span>{{subItem.menuname}}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单
      menulist: [],
      icon: {
        '1': 'el-icon-user-solid',
        '2': 'el-icon-s-order',
        '3': 'el-icon-s-marketing'
      },
      isCollapse: true
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    async logout () {
      const { data: res } = await this.$http.get('dark/admin/logout')
      if (res.meta.status !== 200) {
        return this.$message.error('系统异常')
      }
      this.$message.success(res.meta.msg)
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('dark/admin/menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
    },
    // 菜单折叠
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}

.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 2%;
    align-items: center;
    color: #ffffff;
    font-size: 25px;
}

.el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
}

.el-main {
    background-color: #EAEDF1;
}

.toggle-button{
  background-color: #4A5063;
  font-size: 10px;
  line-height: 30px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

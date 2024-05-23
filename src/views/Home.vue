<template>
  <el-container style="height: 100%;">
    <el-container>
      <el-aside style="width: 15%;height: 100%; background-color: #545c64;">
        <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
          <recursion-menu :dataToSon="adminMenuData" v-if="adminMenuData!=null"></recursion-menu>
        </el-menu>
      </el-aside>
      <el-main style="padding: 0px;">
        <el-header style="background-color: rgb(239,242,247); font-size: 12px; height: 45px;">
          <p style="float: left; color: rgb(151,167,190);">{{ $route.meta.title }}</p>
          <p style="float: right; cursor: pointer;" @click="onLogout">退出登录</p>
        </el-header>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import adminMenuApi from "../api/admin/adminMenu.js";
import adminMenuFunctionApi from "../api/admin/adminMenuFunction";
import sysUserApi from '../api/sys/sysUser.js';
import router from "../router/index.js";
import {ElMessage} from 'element-plus'
import recursionMenu from '../components/RecursionMenu.vue';

const handleSelect = (index) => {
  recursionRouter(adminMenuData.value, index);
};
const recursionRouter = (adminMenuList, index) => {
  adminMenuList.forEach((item) => {
    if (item.index == index) {
      loadFunctionList(item.id, item.path);
    } else {
      if (item.childList != null) {
        recursionRouter(item.childList, index);
      }
    }
  });
};
const loadFunctionList = async (adminMenuId, path) => {
  const functionList = await adminMenuFunctionApi.list({mode: 2, adminMenuId: adminMenuId});
  sessionStorage.setItem("functionList", JSON.stringify(functionList.data));
  router.push({path: path});
}
const adminMenuData = ref(null);
const fetchAdminMenuData = async () => {
  const adminMenu = await adminMenuApi.listTree({mode: 2});
  recursionRmNoAuth(adminMenu.data)
  recursionSetIndex(null, adminMenu.data);
  adminMenuData.value = await adminMenu.data;
};
const recursionRmNoAuth = (adminMenuList) => {
  for (let i = 0; i < adminMenuList.length; i++) {
    if (adminMenuList[i].isAuth == null || !adminMenuList[i].isAuth) {
      adminMenuList.splice(adminMenuList.indexOf(adminMenuList[i]), 1);
    } else {
      if(adminMenuList[i].childList!=null){
        recursionRmNoAuth(adminMenuList[i].childList);
      }
    }
  }
};
const recursionSetIndex = (parentAdminMenu, adminMenuList) => {
  for (let i = 0; i < adminMenuList.length; i++) {
    if (parentAdminMenu == null) {
      adminMenuList[i].index = i + 1;
    } else {
      adminMenuList[i].index = parentAdminMenu.index + '-' + (i + 1);
    }
    if (adminMenuList[i].childList != null) {
      recursionSetIndex(adminMenuList[i], adminMenuList[i].childList);
    }
  }
};
const onLogout = async () => {
  await sysUserApi.logout();
  sessionStorage.clear();
  ElMessage.success("退出成功");
  router.push({path: "/login"});
};
onMounted(() => {
  fetchAdminMenuData();
});
</script>

<style scoped>
.el-menu-vertical-demo {
  border-right: 0;
}
</style>
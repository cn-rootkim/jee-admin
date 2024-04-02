<script setup lang="ts">
import { ref,defineProps } from 'vue';
type HeaderProps = {
  dataToSon: number[];
};
const props = defineProps<HeaderProps>();
const menuList = props.dataToSon;
// console.log('menuList='+menuList)
</script>

<template>
  <template v-for="item in menuList" :key="item.id">
    <!-- 非叶子节点 -->
    <el-sub-menu v-if="item.childList" :index="item.index">
      <template #title>
        <span v-text="item.name"></span>
      </template>
      <recursion-menu :dataToSon="item.childList"/>
    </el-sub-menu>
    <!-- 叶子节点（功能节点） -->
    <el-menu-item v-else :index="item.index" v-text="item.name"></el-menu-item>
  </template>
</template>

<style scoped lang="stylus">
</style>
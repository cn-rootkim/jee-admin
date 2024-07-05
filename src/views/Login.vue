<template>
  <div>
    <el-container style="width: 30%;  margin-left: auto; margin-right: auto; padding-top: 10%;">
      <el-header>
        <div style="width: 400px;">
          <p style="float: left;">
            <el-icon color="#409EFF" :size="50">
              <ElementPlus/>
            </el-icon>
          </p>
          <p style="float: left;font-size: 25px;font-weight: bold;">
            {{ this.$systemName }}
          </p>
        </div>
      </el-header>
      <el-main>
        <el-card class="login_card">
          <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="80px">
            <el-form-item label="账号：" prop="username">
              <el-input v-model="form.username" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input type="password" v-model="form.password" placeholder="请输入密码"
                        @keyup.enter="onSubmit()"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit()">登录</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script setup>
import sysUserApi from "../api/sys/sysUser.js";
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import router from "../router/index";

const form = reactive({
  username: "",
  password: "",
});
const ruleFormRef = ref();
const rules = reactive({
  username: [{required: true, message: "请输入账号", trigger: "blur"}],
  password: [{required: true, message: "请输入密码", trigger: "blur"}],
});
const onSubmit = () => {
  if (!ruleFormRef) return;
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const res = await sysUserApi.loginByUsernameAndPassword(form);
      ElMessage.success("登录成功");
      localStorage.setItem("token", res.data.token);
      await router.push({path: "/home"});
    } else {
      return false;
    }
  });
};
const resetForm = () => {
  if (!ruleFormRef) return;
  ruleFormRef.value.resetFields();
};
</script>
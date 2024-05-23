<template>
  <el-main>
    <el-form :inline="true" style="text-align: left;" :model="formData" ref="formRef">
      <el-form-item label="用户名">
        <el-input clearable v-model="formData.username" style="width: 170px;"/>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input clearable v-model="formData.name" style="width: 170px;"/>
      </el-form-item>
      <el-form-item label="账号状态">
        <el-select clearable style="width: 170px;" v-model="formData.isEnabled">
          <el-option label="启用" value="0"/>
          <el-option label="禁用" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 10px; text-align: left;">
      <el-button @click="onAdd" :disabled="onAddDisabled">新增</el-button>
      <el-button @click="onDelete" type="danger" :disabled="onDeleteDisabled">删除</el-button>
      <el-button @click="onUpdate" :disabled="onUpdateDisabled">修改</el-button>
      <el-button @click="onUpdatePassWord" :disabled="onUpdatePassWordDisabled">修改密码</el-button>
    </div>
    <el-table
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column property="username" label="用户名" width="220"/>
      <el-table-column property="name" label="姓名" width="220"/>
      <el-table-column property="isEnabled" label="账号状态"/>
      <el-table-column property="createTime" label="创建时间"/>
      <el-table-column property="createrName" label="创建人"/>
      <el-table-column property="updateTime" label="修改时间"/>
      <el-table-column property="updaterName" label="修改人"/>
    </el-table>
    <el-pagination style="margin-top: 10px;" :current-page="currentPage" :page-size="pageSize"
                   background layout="total, prev, pager, next, jumper" :total="total"
                   @current-change="handleCurrentChange"/>

    <el-dialog v-model="dialogAddVisible" title="新增" width="500" destroy-on-close :close-on-click-modal="false">
      <el-form :model="addFormData" style="margin-left: 60px" :rules="addRules" ref="addRuleFormRef">
        <el-form-item label="用户名" :label-width="addFormLabelWidth" prop="username">
          <el-input v-model="addFormData.username" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="密码" :label-width="addFormLabelWidth" prop="password">
          <el-input v-model="addFormData.password" autocomplete="off" style="width: 200px;" type="password"/>
        </el-form-item>
        <el-form-item label="姓名" :label-width="addFormLabelWidth">
          <el-input v-model="addFormData.name" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="账号状态" :label-width="addFormLabelWidth" prop="isEnabled">
          <el-select clearable style="width: 200px;" v-model="addFormData.isEnabled">
            <el-option label="启用" value="0"/>
            <el-option label="禁用" value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" :label-width="addFormLabelWidth" prop="roleIdList">
          <el-select clearable style="width: 200px;" v-model="addFormData.roleIdList" multiple>
            <el-option v-for="role in roleList" :label="role.name" :value="role.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogAddVisible = false">取消</el-button>
          <el-button type="primary" @click="onAddSubmit">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogUpdateVisible" title="修改" width="500" destroy-on-close :close-on-click-modal="false">
      <el-form :model="updateFormData" style="margin-left: 60px" :rules="updateRules" ref="updateRuleFormRef">
        <el-form-item label="用户名" :label-width="updateFormLabelWidth" prop="username">
          <el-input v-model="updateFormData.username" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="姓名" :label-width="updateFormLabelWidth">
          <el-input v-model="updateFormData.name" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="账号状态" :label-width="updateFormLabelWidth" prop="isEnabled">
          <el-select clearable style="width: 200px;" v-model="updateFormData.isEnabled">
            <el-option label="启用" value="0"/>
            <el-option label="禁用" value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" :label-width="updateFormLabelWidth" prop="roleIdList">
          <el-select clearable style="width: 200px;" v-model="updateFormData.roleIdList" multiple>
            <el-option v-for="role in roleList" :label="role.name" :value="role.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogUpdateVisible = false">取消</el-button>
          <el-button type="primary" @click="onUpdateSubmit">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogUpdatePassWordVisible" title="修改密码" width="500" destroy-on-close
               :close-on-click-modal="false">
      <el-form :model="updatePassWordFormData" style="margin-left: 60px" :rules="updatePassWordRules"
               ref="updatePassWordRuleFormRef">
        <el-form-item label="密码" :label-width="updatePassWordFormLabelWidth" prop="password">
          <el-input v-model="updatePassWordFormData.password" autocomplete="off" style="width: 200px;" type="password"/>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="updatePassWordFormLabelWidth" prop="confirmPassword">
          <el-input v-model="updatePassWordFormData.confirmPassword" autocomplete="off" style="width: 200px;"
                    type="password"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogUpdatePassWordVisible = false">取消</el-button>
          <el-button type="primary" @click="onUpdatePassWordSubmit">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-main>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import {ElTable, ElForm, ElMessage, ElMessageBox} from 'element-plus'
import sysUserApi from "../../api/sys/sysUser.js";
import sysRoleApi from "../../api/sys/sysRole.js";

interface SysUser {
  id: string
  username: string
  password: string
  name: string
  isEnabled: string
  roleIdList: Array<string>
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<SysUser[]>([]);
const tableData = ref();
const formData = ref({
  username: null,
  name: null,
  isEnabled: null,
});
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogAddVisible = ref(false);
const dialogUpdateVisible = ref(false);
const dialogUpdatePassWordVisible = ref(false);
const addFormLabelWidth = ref('80px');
const updateFormLabelWidth = ref('80px');
const updatePassWordFormLabelWidth = ref('80px');
const addRuleFormRef = ref();
const addRules = reactive({
  username: [{required: true, message: "请输入用户名", trigger: "blur"}],
  password: [{required: true, message: "请输入密码", trigger: "blur"}],
  isEnabled: [{required: true, message: "请选择账号状态", trigger: "blur"}],
  roleIdList: [{required: true, message: "请选择角色", trigger: "blur"}],
});
const updateRuleFormRef = ref();
const updateRules = reactive({
  username: [{required: true, message: "请输入账号", trigger: "blur"}],
  isEnabled: [{required: true, message: "请选择账号状态", trigger: "blur"}],
  roleIdList: [{required: true, message: "请选择角色", trigger: "blur"}],
});
const updatePassWordRuleFormRef = ref();
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value == undefined || value === '') {
    callback(new Error('请输入确认密码'))
  } else if (value !== updatePassWordFormData.value['password']) {
    callback(new Error("密码不一致"))
  } else {
    callback()
  }
}
const updatePassWordRules = reactive({
  password: [{required: true, message: "请输入密码", trigger: "blur"}],
  confirmPassword: [{required: true, trigger: "blur", validator: validateConfirmPassword}],
});
const addFormData = ref<SysUser>({
  username: null,
  password: null,
  name: null,
  isEnabled: '0',
  roleIdList: null,
});
const updateFormData = ref<SysUser>({
  id: null,
  username: null,
  password: null,
  name: null,
  isEnabled: null,
  roleIdList: null,
});
const updatePassWordFormData = ref();
const roleList = ref();

const handleSelectionChange = (val: SysUser[]) => {
  multipleSelection.value = val
}

const fetchListData = async (current: number) => {
  const listData = await sysUserApi.page({
    current: current,
    size: pageSize.value,
    username: formData.value.username,
    name: formData.value.name,
    isEnabled: formData.value.isEnabled
  });
  // console.log(listData);
  listData.data.records.forEach((item: any) => {
    item.isEnabled = item.isEnabled == 0 ? '启用' : '禁用';
  });
  total.value = listData.data.total;
  currentPage.value = current;
  tableData.value = await listData.data.records;
}
const onAddDisabled = ref(true);
const onDeleteDisabled = ref(true);
const onUpdateDisabled = ref(true);
const onUpdatePassWordDisabled = ref(true);
onMounted(() => {
  const functionListStr = sessionStorage.getItem("functionList");
  if (functionListStr != null && functionListStr != '') {
    const functionList = JSON.parse(functionListStr);
    functionList.forEach(item => {
      if (item.isAuth) {
        switch (item.name) {
          case '新增':
            onAddDisabled.value = false;
            break;
          case '删除':
            onDeleteDisabled.value = false;
            break;
          case '修改':
            onUpdateDisabled.value = false;
            break;
          case '修改密码':
            onUpdatePassWordDisabled.value = false;
            break;
        }
      }
    })
  }
  fetchListData(1);
  fetchRoleList();
});

const handleCurrentChange = (val) => {
  currentPage.value = val;
  // console.log(`当前页: ${val}`)
  fetchListData(val);
}

const onSubmit = () => {
  fetchListData(1);
}

const onAdd = () => {
  addFormData.value = {
    id: null,
    username: null,
    password: null,
    name: null,
    isEnabled: '0',
    roleIdList: null,
  };
  dialogAddVisible.value = true;
}

const onUpdate = async () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning('请选择一条数据');
    return;
  } else if (multipleSelection.value.length > 1) {
    ElMessage.warning('只能选择一条数据');
    return;
  }
  const sysUserInfo = await sysUserApi.info({id: multipleSelection.value[0].id});
  console.log(sysUserInfo.data);
  dialogUpdateVisible.value = true;
  updateFormData.value = sysUserInfo.data;
  updateFormData.value.isEnabled = sysUserInfo.data.isEnabled.toString();
}

const onUpdatePassWord = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning('请选择一条数据');
    return;
  } else if (multipleSelection.value.length > 1) {
    ElMessage.warning('只能选择一条数据');
    return;
  }
  dialogUpdatePassWordVisible.value = true;
  updatePassWordFormData.value = {"id": multipleSelection.value[0].id};
}

const onDelete = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning('请选择数据');
    return;
  }
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    sysUserApi.batchDelete({idList: multipleSelection.value.map(item => item.id)}).then((res) => {
      ElMessage.success('删除成功');
      fetchListData(1);
    });
  }).catch(() => {
  });
}

const onAddSubmit = () => {
  if (!addRuleFormRef) return;
  addRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      sysUserApi.add(addFormData.value).then((res) => {
        ElMessage.success('新增成功');
        dialogAddVisible.value = false;
        fetchListData(1);
      });
    } else {
      return false;
    }
  });
}

const onUpdateSubmit = () => {
  if (!updateRuleFormRef) return;
  updateRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      sysUserApi.update(updateFormData.value).then((res) => {
        ElMessage.success('修改成功');
        dialogUpdateVisible.value = false;
        fetchListData(1);
      });
    } else {
      return false;
    }
  });
}

const onUpdatePassWordSubmit = () => {
  if (!updatePassWordRuleFormRef) return;
  updatePassWordRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      sysUserApi.update(updatePassWordFormData.value).then((res) => {
        ElMessage.success('修改成功');
        dialogUpdatePassWordVisible.value = false;
      });
    } else {
      return false;
    }
  });
}

const fetchRoleList = async () => {
  const roleListData = await sysRoleApi.list();
  roleList.value = await roleListData.data;
}
</script>
<style scoped>
</style>
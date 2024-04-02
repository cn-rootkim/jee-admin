<template>
  <el-main>
    <el-form :inline="true" style="text-align: left;" :model="formData" ref="formRef" >
      <el-form-item label="角色名">
        <el-input clearable v-model="formData.name" style="width: 170px;"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 10px; text-align: left;">
      <el-button @click="onAdd" :disabled="onAddDisabled">新增</el-button>
      <el-button @click="onDelete" type="danger" :disabled="onDeleteDisabled">删除</el-button>
      <el-button @click="onUpdate" :disabled="onUpdateDisabled">修改</el-button>
      <el-button @click="onMenuAuth" :disabled="onMenuAuthDisabled">菜单授权</el-button>
      <el-button @click="onFunctionAuth" :disabled="onFunctionAuthDisabled">功能授权</el-button>
      <el-button @click="onApiAuth" :disabled="onApiAuthDisabled">接口授权</el-button>
    </div>
    <el-table
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="name" label="角色名" width="220" />
      <el-table-column property="description" label="备注" show-overflow-tooltip />
      <el-table-column property="createTime" label="创建时间" />
      <el-table-column property="createrName" label="创建人" />
      <el-table-column property="updateTime" label="修改时间"/>
      <el-table-column property="updaterName" label="修改人" />
    </el-table>
    <el-pagination style="margin-top: 10px;" :current-page="currentPage" :page-size="pageSize"
                   background layout="total, prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange"/>

    <el-dialog v-model="dialogAddVisible" title="新增" width="500" destroy-on-close :close-on-click-modal="false">
      <el-form :model="addFormData" style="margin-left: 60px" :rules="addRules" ref="addRuleFormRef">
        <el-form-item label="角色名" :label-width="addFormLabelWidth" prop="name">
          <el-input v-model="addFormData.name" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="备注" :label-width="addFormLabelWidth">
          <el-input v-model="addFormData.description" autocomplete="off" style="width: 200px;"/>
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
        <el-form-item label="角色名" :label-width="updateFormLabelWidth" prop="name">
          <el-input v-model="updateFormData.name" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="备注" :label-width="updateFormLabelWidth">
          <el-input v-model="updateFormData.description" autocomplete="off" style="width: 200px;"/>
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
    <el-dialog v-model="dialogMenuAuthVisible" title="菜单授权" width="500" destroy-on-close :close-on-click-modal="false">
      <el-tree
          ref="refListTree"
          style="width: 100%;"
          :data="adminMenuTreeData"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-checked-keys="menuAuthCheckedKeys"
          check-strictly="true"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogMenuAuthVisible = false">取消</el-button>
          <el-button type="primary" @click="onMenuAuthSubmit">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogFunctionAuthVisible" title="功能授权" width="500" :close-on-click-modal="false" destroy-on-close>
      <el-row>
        <el-col :span="12">
          <el-tree
              style="width: 100%;"
              :data="adminMenuTreeData"
              node-key="id"
              :props="defaultProps"
              @node-click="handleNodeClick"
          />
        </el-col>
        <el-col :span="12">
          <el-table
              ref="multipleFunctionTableRef"
              :data="functionTableData"
              @selection-change="handleFunctionSelectionChange"
              style="width: 100%;"
              @select="onFunctionAuthSelect"
              @selectAll="onFunctionAuthSelectAll"
          >
            <el-table-column type="selection" />
            <el-table-column property="name" label="功能名称" />
            <el-table-column property="adminMenuName" label="归属菜单"/>
          </el-table>
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFunctionAuthVisible = false">取消</el-button>
          <el-button type="primary" @click="onFunctionAuthSubmit">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogApiAuthVisible" title="接口授权" width="500" destroy-on-close :close-on-click-modal="false">
      <el-tree
          style="width: 100%;"
          ref="refApiAuthListTree"
          :data="apiAuthTreeData"
          :props="defaultApiAuthProps"
          node-key="id"
          :default-checked-keys="apiAuthCheckedKeys"
          show-checkbox
      >
        <template #default="{ node, data }">
      <span class="custom-tree-node">
          <span>{{ node.label }}【{{data.description}}】</span>
      </span>
        </template>
      </el-tree>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogApiAuthVisible = false">取消</el-button>
            <el-button type="primary" @click="onApiAuthSubmit">
              保存
            </el-button>
          </div>
        </template>
    </el-dialog>
  </el-main>
</template>
<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import { ElTable,ElForm,ElMessage,ElMessageBox } from 'element-plus'
import sysRoleApi from "../../api/sys/sysRole.js";
import adminMenuApi from "../../api/admin/adminMenu.js";
import adminMenuFunctionApi from "../../api/admin/adminMenuFunction.js";
import sysApiBasePath from "../../api/sys/sysApiBasePath.js";
import sysApi from "../../api/sys/sysApi.js";

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref([]);
const tableData =ref();
const formData = ref({
  name: null
});
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogAddVisible = ref(false);
const dialogUpdateVisible = ref(false);
const addFormLabelWidth = ref('80px');
const updateFormLabelWidth = ref('80px');
const addRuleFormRef = ref();
const addRules = reactive({
  name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
});
const updateRuleFormRef = ref();
const updateRules = reactive({
  name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
});
const addFormData = ref({
  name: null,
  description: null,
});
const updateFormData = ref({
  id: null,
  name: null,
  description: null,
});
const handleSelectionChange = (val: []) => {
  multipleSelection.value = val
}

const fetchListData = async (current:number) => {
  const listData = await sysRoleApi.page({current: current, size: pageSize.value, name: formData.value.name});
  total.value = listData.data.total;
  currentPage.value = current;
  tableData.value = await listData.data.records;
}
const defaultProps = {
  children: 'childList',
  label: 'name',
  value: 'id'
}
const adminMenuTreeData = ref(null);
const fetchAdminMenuTreeData = async () => {
  const adminMenu = await adminMenuApi.listTree();
  adminMenuTreeData.value = adminMenu.data;
};
const onAddDisabled = ref(true);
const onDeleteDisabled = ref(true);
const onUpdateDisabled = ref(true);
const onMenuAuthDisabled = ref(true);
const onFunctionAuthDisabled = ref(true);
const onApiAuthDisabled = ref(true);
onMounted(() => {
  const funNameListAuthorizedStr = sessionStorage.getItem("funNameListAuthorized");
  if(funNameListAuthorizedStr!=null && funNameListAuthorizedStr!=''){
    const funNameListAuthorized = JSON.parse(funNameListAuthorizedStr);
    funNameListAuthorized.forEach(item =>{
      switch (item) {
        case '新增':
          onAddDisabled.value = false;
          break;
        case '删除':
          onDeleteDisabled.value = false;
          break;
        case '修改':
          onUpdateDisabled.value = false;
          break;
        case '菜单授权':
          onMenuAuthDisabled.value = false;
          break;
        case '功能授权':
          onFunctionAuthDisabled.value = false;
          break;
        case '接口授权':
          onApiAuthDisabled.value = false;
          break;
      }
    })
  }
  fetchListData(1);
  fetchAdminMenuTreeData();
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
    name: null,
    description: null,
  };
  dialogAddVisible.value = true;
}
const onUpdate = async () => {
  if(multipleSelection.value.length == 0){
    ElMessage.warning('请选择一条数据');
    return;
  }else if(multipleSelection.value.length > 1){
    ElMessage.warning('只能选择一条数据');
    return;
  }
  dialogUpdateVisible.value = true;
  updateFormData.value = {...multipleSelection.value[0]};
}
const onDelete = () => {
  if(multipleSelection.value.length == 0){
    ElMessage.warning('请选择数据');
    return;
  }
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    sysRoleApi.batchDelete({idList: multipleSelection.value.map(item => item.id)}).then((res) => {
      ElMessage.success('删除成功');
      fetchListData(1);
    });
  }).catch(() => {
  });
}
const onAddSubmit = () => {
  if(!addRuleFormRef) return;
  addRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      sysRoleApi.add(addFormData.value).then((res) => {
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
  if(!updateRuleFormRef) return;
  updateRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      sysRoleApi.update(updateFormData.value).then((res) => {
        ElMessage.success('修改成功');
        dialogUpdateVisible.value = false;
        fetchListData(1);
      });
    } else {
      return false;
    }
  });
}
const dialogMenuAuthVisible = ref(false);
const authRoleId = ref(null);
const menuAuthCheckedKeys = ref(null);
const onMenuAuth = async () => {
  if(multipleSelection.value.length == 0){
    ElMessage.warning('请选择一条数据');
    return;
  }else if(multipleSelection.value.length > 1){
    ElMessage.warning('只能选择一条数据');
    return;
  }
  authRoleId.value = multipleSelection.value[0].id;
  const adminMenuListAll = await adminMenuApi.listAuthorized({'sysRoleId':authRoleId.value});
  menuAuthCheckedKeys.value = adminMenuListAll.data.map(item => item.id);
  dialogMenuAuthVisible.value = true;
}
const refListTree = ref();
const onMenuAuthSubmit = async () =>{
  await sysRoleApi.authAdminMenu({sysRoleId: authRoleId.value, adminMenuIdList: refListTree.value.getCheckedKeys()});
  ElMessage.success('授权成功');
  dialogMenuAuthVisible.value = false;
}
const dialogFunctionAuthVisible = ref(false);
const onFunctionAuth = () => {
  if(multipleSelection.value.length == 0){
    ElMessage.warning('请选择一条数据');
    return;
  }else if(multipleSelection.value.length > 1){
    ElMessage.warning('只能选择一条数据');
    return;
  }
  authRoleId.value = multipleSelection.value[0].id;
  dialogFunctionAuthVisible.value = true;
}
const funIdListAuthorized = ref();
const fetchFunIdListAuthorized = async () => {
  const idListAuthorized = await adminMenuFunctionApi.idListAuthorized({sysRoleId: authRoleId.value,adminMenuId: checkedAdminMenuId.value});
  funIdListAuthorized.value = idListAuthorized.data;
}
const functionTableData = ref();
const checkedAdminMenuId = ref();
const handleNodeClick = (data: any) => {
  if(!data.childList){
    checkedAdminMenuId.value = data.id;
    fetchAdminMenuFunctionData();
    fetchFunIdListAuthorized();
  }
}
const multipleFunctionTableRef = ref();
const fetchAdminMenuFunctionData = async () => {
  const adminMenuFunctionList = await adminMenuFunctionApi.list({adminMenuId: checkedAdminMenuId.value});
  functionTableData.value = adminMenuFunctionList.data;
  setTimeout(() => {
    functionTableData.value.forEach(item => {
      for(let i = 0; i < funIdListAuthorized.value.length; i++){
        if(item.id == funIdListAuthorized.value[i]){
          multipleFunctionTableRef.value.toggleRowSelection(item,true);
          item.isAuthorized = 0;
          break;
        }
      }
      if(item.isAuthorized==null){
        item.isAuthorized = 1;
      }
    });
  }, 100);
}
const multipleFunctionSelection = ref([]);
const handleFunctionSelectionChange = (val: []) => {
  multipleFunctionSelection.value = val
}
const onFunctionAuthSubmit = async () => {
  ElMessage.success('保存成功');
  dialogFunctionAuthVisible.value = false;
}
const onFunctionAuthSelect = async(selection, row) => {
  const adminMenuFunctionIdList = [];
  selection.forEach(item => {
    adminMenuFunctionIdList.push(item.id);
  });
  await sysRoleApi.authAdminMenuFunction({
    sysRoleId: authRoleId.value,
    adminMenuId: checkedAdminMenuId.value,
    adminMenuFunctionIdList:adminMenuFunctionIdList
  }).then((res) => {
    ElMessage.success('授权成功');
  });
}
const onFunctionAuthSelectAll = async(selection) => {
  const adminMenuFunctionIdList = [];
  selection.forEach(item => {
    adminMenuFunctionIdList.push(item.id);
  });
  await sysRoleApi.authAdminMenuFunction({
    sysRoleId: authRoleId.value,
    adminMenuId: checkedAdminMenuId.value,
    adminMenuFunctionIdList:adminMenuFunctionIdList
  }).then((res) => {
    ElMessage.success('授权成功');
  });
}
const dialogApiAuthVisible = ref(false);
const apiAuthTreeData = ref();
const defaultApiAuthProps = {
  children: 'sysApiDTOList',
  label: 'api',
}
const apiAuthCheckedKeys = ref();
const onApiAuth = async () => {
  if(multipleSelection.value.length == 0){
    ElMessage.warning('请选择一条数据');
    return;
  }else if(multipleSelection.value.length > 1){
    ElMessage.warning('只能选择一条数据');
    return;
  }
  authRoleId.value = multipleSelection.value[0].id;
  const sysApiBasePathList = await sysApiBasePath.listWithApiList();
  sysApiBasePathList.data.forEach(item => {
    item.api = item.basePath;
  })
  const idListAuthorized = await sysApi.idListAuthorized({sysRoleId: authRoleId.value});
  apiAuthCheckedKeys.value = idListAuthorized.data;
  apiAuthTreeData.value = sysApiBasePathList.data;
  dialogApiAuthVisible.value = true;
}
const refApiAuthListTree = ref();
const onApiAuthSubmit = async () => {
  const sysApiIdList = [];
  refApiAuthListTree.value.getCheckedNodes().forEach(item => {
    if(item.sysApiBasePathId!=null){
      sysApiIdList.push(item.id);
    }
  })
  await sysRoleApi.authSysApi({sysRoleId: authRoleId.value, sysApiIdList: sysApiIdList});
  ElMessage.success('授权成功');
  dialogApiAuthVisible.value = false;
}
</script>
<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
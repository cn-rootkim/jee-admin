<template>
  <el-main>
    <el-row>
      <el-col :span="12">
        <el-row>
          <div>
            <el-button @click="onAddMenu" :disabled="onAddMenuDisabled">新增菜单</el-button>
            <el-button @click="onDeleteMenu" type="danger" :disabled="onDeleteMenuDisabled">删除菜单</el-button>
          </div>
        </el-row>
        <el-row>
          <el-tree
              ref="refListTree"
              style="width: 100%; float: left;"
              :data="adminMenuData"
              show-checkbox
              node-key="id"
              :props="defaultProps"
              @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button style="margin-left: 8px;" @click="onUpdateMenu(data)" size="small"
                               :disabled="onUpdateMenuDisabled">修改菜单</el-button>
                  </span>
                </span>
            </template>
          </el-tree>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row>
          <div>
            <el-button @click="onAddFunction" :disabled="onAddFunctionDisabled">新增功能</el-button>
            <el-button @click="onDeleteFunction" type="danger" :disabled="onDeleteFunctionDisabled">删除功能</el-button>
            <el-button @click="onUpdateFunction" :disabled="onUpdateFunctionDisabled">修改功能</el-button>
          </div>
        </el-row>
        <el-row>
          <el-table
              ref="multipleTableRef"
              :data="tableData"
              @selection-change="handleSelectionChange"
              style="width: 100%;"
          >
            <el-table-column type="selection"/>
            <el-table-column property="name" label="功能名称"/>
            <el-table-column property="adminMenuName" label="归属菜单"/>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
    <menuAdd :dialogAddMenuVisible="dialogAddMenuVisible" :addMenuFormData="addMenuFormData" @success="addMenuSuccess"
             :adminMenuData="adminMenuData"></menuAdd>
    <menuUpdate :dialogUpdateMenuVisible="dialogUpdateMenuVisible" :updateMenuFormData="updateMenuFormData"
                @success="updateMenuSuccess" :adminMenuData="adminMenuData"></menuUpdate>
    <menuFunctionAdd :dialogAddFunctionVisible="dialogAddFunctionVisible" :addFunctionFormData="addFunctionFormData"
                     :adminMenuData="adminMenuData" @success="addFunctionSuccess"></menuFunctionAdd>
    <menuFunctionUpdate :dialogUpdateFunctionVisible="dialogUpdateFunctionVisible"
                        :updateFunctionFormData="updateFunctionFormData" :adminMenuData="adminMenuData"
                        @success="updateFunctionSuccess"></menuFunctionUpdate>
  </el-main>
</template>
<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import adminMenuApi from "../../api/admin/adminMenu.js";
import adminMenuFunctionApi from "../../api/admin/adminMenuFunction.js";
import {ElForm, ElMessage, ElMessageBox, ElTable} from 'element-plus'
import menuAdd from '../../components/admin/menu/Add.vue';
import menuUpdate from '../../components/admin/menu/Update.vue';
import menuFunctionAdd from '../../components/admin/menuFunction/Add.vue';
import menuFunctionUpdate from '../../components/admin/menuFunction/Update.vue';

//---------------------------------------------------------主页面处理---------------------------------------------------------
const defaultProps = {//菜单树数据属性
  children: 'childList',
  label: 'name',
  value: 'id'
}
const adminMenuData = ref([]);//菜单树数据
const tableData = ref([]);//菜单功能列表数据
const clickedAdminMenu = ref({//点击的菜单数据
  id: null,
  name: null,
  path: null,
  parentId: null,
});
const handleNodeClick = (data: any) => {//菜单点击事件
  if (!data.childList) {
    clickedAdminMenu.value = data;
    fetchAdminMenuFunctionData();
  }
}
const fetchAdminMenuData = async () => {//获取菜单树数据
  const adminMenu = await adminMenuApi.listTree({mode: 0});
  adminMenuData.value = adminMenu.data;
};
const onAddMenuDisabled = ref(true);
const onDeleteMenuDisabled = ref(true);
const onUpdateMenuDisabled = ref(true);
const onAddFunctionDisabled = ref(true);
const onDeleteFunctionDisabled = ref(true);
const onUpdateFunctionDisabled = ref(true);
onMounted(() => {//进入页面事件
  const functionListStr = sessionStorage.getItem("functionList");
  if (functionListStr != null && functionListStr != '') {
    const functionList = JSON.parse(functionListStr);
    functionList.forEach(item => {
      if (item.isAuth) {
        switch (item.name) {
          case '新增菜单':
            onAddMenuDisabled.value = false;
            break;
          case '删除菜单':
            onDeleteMenuDisabled.value = false;
            break;
          case '修改菜单':
            onUpdateMenuDisabled.value = false;
            break;
          case '新增功能':
            onAddFunctionDisabled.value = false;
            break;
          case '删除功能':
            onDeleteFunctionDisabled.value = false;
            break;
          case '修改功能':
            onUpdateFunctionDisabled.value = false;
            break;
        }
      }
    })
  }
  fetchAdminMenuData();
});

const fetchAdminMenuFunctionData = async () => {
  const adminMenuFunction = await adminMenuFunctionApi.list({"adminMenuId": clickedAdminMenu.value.id, mode: 0});
  adminMenuFunction.data.forEach(item => {
    item.adminMenuName = clickedAdminMenu.value.name;
  });
  tableData.value = adminMenuFunction.data;
};

const dialogAddMenuVisible = ref(false);
const dialogUpdateMenuVisible = ref(false);
const addMenuFormData = ref({
  name: null,
  path: null,
  parentId: null,
});
const updateMenuFormData = ref({
  name: null,
  path: null,
  parentId: null,
});
const onAddMenu = () => {
  addMenuFormData.value = {
    name: null,
    path: null,
    parentId: null,
  };
  dialogAddMenuVisible.value = true;
};
const onUpdateMenu = (data) => {
  updateMenuFormData.value = {...data};
  dialogUpdateMenuVisible.value = true;
};
const addMenuSuccess = () => {
  dialogAddMenuVisible.value = false;
  tableData.value = null;
  fetchAdminMenuData();
}
const updateMenuSuccess = () => {
  dialogUpdateMenuVisible.value = false;
  tableData.value = null;
  fetchAdminMenuData();
}

const refListTree = ref();
const onDeleteMenu = () => {
  const menuIdList = refListTree.value.getCheckedKeys();
  if (menuIdList.length == 0) {
    ElMessage.warning('请选择数据');
    return;
  }
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    adminMenuApi.batchDelete({idList: menuIdList}).then((res) => {
      ElMessage.success('删除成功');
      fetchAdminMenuData();
      tableData.value = null;
    });
  }).catch(() => {
  });
}
const dialogAddFunctionVisible = ref(false);
const dialogUpdateFunctionVisible = ref(false);
const addFunctionFormData = ref({
  name: null,
  adminMenuId: null,
});
const updateFunctionFormData = ref({
  name: null,
  adminMenuId: null,
});
const onAddFunction = () => {
  addFunctionFormData.value = {
    name: null,
    adminMenuId: clickedAdminMenu.value.id,
  }
  dialogAddFunctionVisible.value = true;
};
const onUpdateFunction = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning('请选择一条数据');
    return;
  } else if (multipleSelection.value.length > 1) {
    ElMessage.warning('只能选择一条数据');
    return;
  } else {
    updateFunctionFormData.value = {...multipleSelection.value[0]};
    dialogUpdateFunctionVisible.value = true;
  }
};
const addFunctionSuccess = () => {
  dialogAddFunctionVisible.value = false;
  tableData.value = null;
  fetchAdminMenuFunctionData();
}
const updateFunctionSuccess = () => {
  dialogUpdateFunctionVisible.value = false;
  tableData.value = null;
  fetchAdminMenuFunctionData();
}
const multipleSelection = ref([]);
const handleSelectionChange = (val: []) => {
  multipleSelection.value = val
}
const onDeleteFunction = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning('请选择数据');
    return;
  }
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    adminMenuFunctionApi.batchDelete({idList: multipleSelection.value.map(item => item.id)}).then((res) => {
      ElMessage.success('删除成功');
      fetchAdminMenuData();
      tableData.value = null;
    });
  }).catch(() => {
  });
}
</script>
<style scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
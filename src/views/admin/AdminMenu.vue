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
    <el-dialog v-model="dialogAddMenuVisible" title="新增菜单" width="500" destroy-on-close
               :close-on-click-modal="false">
      <el-form :model="addMenuFormData" style="margin-left: 60px" :rules="addMenuRules" ref="addMenuRuleFormRef">
        <el-form-item label="菜单名称" :label-width="addMenuFormLabelWidth" prop="name">
          <el-input v-model="addMenuFormData.name" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="菜单路径" :label-width="addMenuFormLabelWidth">
          <el-input v-model="addMenuFormData.path" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="父级菜单" :label-width="addMenuFormLabelWidth">
          <el-tree-select
              v-model="addMenuFormData.parentId"
              :data="adminMenuData"
              check-strictly
              :render-after-expand="false"
              :props="defaultProps"
              style="width: 200px"
              clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogAddMenuVisible = false">取消</el-button>
          <el-button type="primary" @click="onAddMenuSubmit">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogUpdateMenuVisible" title="修改菜单" width="500" destroy-on-close
               :close-on-click-modal="false">
      <el-form :model="updateMenuFormData" style="margin-left: 60px" :rules="updateMenuRules"
               ref="updateMenuRuleFormRef">
        <el-form-item label="菜单名称" :label-width="updateMenuFormLabelWidth" prop="name">
          <el-input v-model="updateMenuFormData.name" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="菜单路径" :label-width="updateMenuFormLabelWidth">
          <el-input v-model="updateMenuFormData.path" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="父级菜单" :label-width="updateMenuFormLabelWidth">
          <el-tree-select
              v-model="updateMenuFormData.parentId"
              :data="adminMenuData"
              check-strictly
              :render-after-expand="false"
              :props="defaultProps"
              style="width: 200px"
              clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogUpdateMenuVisible = false">取消</el-button>
          <el-button type="primary" @click="onUpdateMenuSubmit">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogAddFunctionVisible" title="新增功能" width="500" destroy-on-close
               :close-on-click-modal="false">
      <el-form :model="addFunctionFormData" style="margin-left: 60px" :rules="addFunctionRules"
               ref="addFunctionRuleFormRef">
        <el-form-item label="功能名称" :label-width="addFunctionFormLabelWidth" prop="name">
          <el-input v-model="addFunctionFormData.name" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="归属菜单" :label-width="addFunctionFormLabelWidth" prop="adminMenuId">
          <el-tree-select
              v-model="addFunctionFormData.adminMenuId"
              :data="adminMenuData"
              check-strictly
              :render-after-expand="false"
              :props="defaultProps"
              style="width: 200px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogAddFunctionVisible = false">取消</el-button>
          <el-button type="primary" @click="onAddFunctionSubmit">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogUpdateFunctionVisible" title="修改功能" width="500" destroy-on-close
               :close-on-click-modal="false">
      <el-form :model="updateFunctionFormData" style="margin-left: 60px" :rules="updateFunctionRules"
               ref="updateFunctionRuleFormRef">
        <el-form-item label="功能名称" :label-width="updateFunctionFormLabelWidth" prop="name">
          <el-input v-model="updateFunctionFormData.name" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="归属菜单" :label-width="updateFunctionFormLabelWidth" prop="adminMenuId">
          <el-tree-select
              v-model="updateFunctionFormData.adminMenuId"
              :data="adminMenuData"
              check-strictly
              :render-after-expand="false"
              :props="defaultProps"
              style="width: 200px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogUpdateFunctionVisible = false">取消</el-button>
          <el-button type="primary" @click="onUpdateFunctionSubmit">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-main>
</template>
<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import adminMenuApi from "../../api/admin/adminMenu.js";
import adminMenuFunctionApi from "../../api/admin/adminMenuFunction.js";
import {ElForm, ElMessage, ElMessageBox, ElTable} from 'element-plus'

const defaultProps = {
  children: 'childList',
  label: 'name',
  value: 'id'
}
const adminMenuData = ref([]);
const tableData = ref([]);
const checkedAdminMenu = ref({
  id: null,
  name: null,
  path: null,
  parentId: null,
});
const handleNodeClick = (data: any) => {
  if (!data.childList) {
    checkedAdminMenu.value = data;
    fetchAdminMenuFunctionData();
  }
}
const fetchAdminMenuData = async () => {
  const adminMenu = await adminMenuApi.listTree({mode: 0});
  adminMenuData.value = adminMenu.data;
};
const onAddMenuDisabled = ref(true);
const onDeleteMenuDisabled = ref(true);
const onUpdateMenuDisabled = ref(true);
const onAddFunctionDisabled = ref(true);
const onDeleteFunctionDisabled = ref(true);
const onUpdateFunctionDisabled = ref(true);
onMounted(() => {
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
  const adminMenuFunction = await adminMenuFunctionApi.list({"adminMenuId": checkedAdminMenu.value.id, mode: 0});
  adminMenuFunction.data.forEach(item => {
    item.adminMenuName = checkedAdminMenu.value.name;
  });
  tableData.value = adminMenuFunction.data;
};
const dialogAddMenuVisible = ref(false);
const dialogUpdateMenuVisible = ref(false);
const addMenuFormLabelWidth = ref('80px');
const updateMenuFormLabelWidth = ref('80px');
const addMenuRuleFormRef = ref();
const addMenuRules = reactive({
  name: [{required: true, message: "请输入菜单名称", trigger: "blur"}],
  path: [{required: true, message: "请输入菜单路径", trigger: "blur"}],
  parentId: [{required: true, message: "请选择父级菜单", trigger: "blur"}],
});
const updateMenuRuleFormRef = ref();
const updateMenuRules = reactive({
  name: [{required: true, message: "请输入菜单名称", trigger: "blur"}],
  path: [{required: true, message: "请输入菜单路径", trigger: "blur"}],
  parentId: [{required: true, message: "请选择父级菜单", trigger: "blur"}],
});
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
  }
  dialogAddMenuVisible.value = true;
};
const onUpdateMenu = (data) => {
  updateMenuFormData.value = {...data};
  dialogUpdateMenuVisible.value = true;
};
const onAddMenuSubmit = () => {
  addMenuRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await adminMenuApi.add(addMenuFormData.value);
      ElMessage.success("新增成功");
      dialogAddMenuVisible.value = false;
      fetchAdminMenuData();
      tableData.value = null;
    } else {
      return false;
    }
  });
};
const onUpdateMenuSubmit = () => {
  updateMenuRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await adminMenuApi.update(updateMenuFormData.value);
      ElMessage.success("修改成功");
      dialogUpdateMenuVisible.value = false;
      fetchAdminMenuData();
      tableData.value = null;
    } else {
      return false;
    }
  });
};
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
const addFunctionFormLabelWidth = ref('80px');
const updateFunctionFormLabelWidth = ref('80px');
const addFunctionRuleFormRef = ref();
const addFunctionRules = reactive({
  name: [{required: true, message: "请输入功能名称", trigger: "blur"}],
  adminMenuId: [{required: true, message: "请选择归属菜单", trigger: "blur"}],
});
const updateFunctionRuleFormRef = ref();
const updateFunctionRules = reactive({
  name: [{required: true, message: "请输入功能名称", trigger: "blur"}],
  adminMenuId: [{required: true, message: "请选择归属菜单", trigger: "blur"}],
});
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
    adminMenuId: checkedAdminMenu.value.id,
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
const onAddFunctionSubmit = () => {
  addFunctionRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await adminMenuFunctionApi.add(addFunctionFormData.value);
      ElMessage.success("新增成功");
      dialogAddFunctionVisible.value = false;
      fetchAdminMenuFunctionData();
      tableData.value = null;
    } else {
      return false;
    }
  });
};
const onUpdateFunctionSubmit = () => {
  updateFunctionRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await adminMenuFunctionApi.update(updateFunctionFormData.value);
      ElMessage.success("修改成功");
      dialogUpdateFunctionVisible.value = false;
      fetchAdminMenuFunctionData();
      tableData.value = null;
    } else {
      return false;
    }
  });
};
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
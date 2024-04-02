<template>
  <div style="text-align: left; margin-top: 20px; margin-left: 20px;">
    <el-button @click="onAddSysApiBasePath" :disabled="onAddSysApiBasePathDisabled">新增父路径</el-button>
    <el-button @click="onAddSysApi" :disabled="onAddSysApiDisabled">新增接口</el-button>
    <el-button @click="onDelete" type="danger" :disabled="onDeleteDisabled">删除</el-button>
  </div>
  <el-tree
      style="margin-left: 20px; margin-top: 20px; width: 80%;"
      ref="refListTree"
      :data="treeData"
      :props="defaultProps"
      show-checkbox
      check-strictly="true"
  >
    <template #default="{ node, data }">
      <span class="custom-tree-node">
          <span>{{ node.label }}【{{data.description}}】</span>
        <span><el-button style="margin-left: 8px" @click="onUpdate(data)" size="small" :disabled="onUpdateDisabled">修改</el-button></span>
      </span>
    </template>
  </el-tree>
  <el-dialog v-model="dialogAddSysApiBasePathVisible" title="新增父路径" width="500" destroy-on-close :close-on-click-modal="false">
    <el-form :model="addSysApiBasePathFormData" style="margin-left: 60px" :rules="addSysApiBasePathRules" ref="addSysApiBasePathRuleFormRef">
      <el-form-item label="父路径名称" :label-width="addSysApiBasePathFormLabelWidth" prop="basePath">
        <el-input v-model="addSysApiBasePathFormData.basePath" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="备注" :label-width="addSysApiBasePathFormLabelWidth" prop="description">
        <el-input v-model="addSysApiBasePathFormData.description" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogAddSysApiBasePathVisible = false">取消</el-button>
        <el-button type="primary" @click="onAddSysApiBasePathSubmit">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogUpdateSysApiBasePathVisible" title="修改父路径" width="500" destroy-on-close :close-on-click-modal="false">
    <el-form :model="updateSysApiBasePathFormData" style="margin-left: 60px" :rules="updateSysApiBasePathRules" ref="updateSysApiBasePathRuleFormRef">
      <el-form-item label="父路径名称" :label-width="updateSysApiBasePathFormLabelWidth" prop="basePath">
        <el-input v-model="updateSysApiBasePathFormData.basePath" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="备注" :label-width="updateSysApiBasePathFormLabelWidth" prop="description">
        <el-input v-model="updateSysApiBasePathFormData.description" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogUpdateSysApiBasePathVisible = false">取消</el-button>
        <el-button type="primary" @click="onUpdateSysApiBasePathSubmit">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogAddSysApiVisible" title="新增接口" width="500" destroy-on-close :close-on-click-modal="false">
    <el-form :model="addSysApiFormData" style="margin-left: 60px" :rules="addSysApiRules" ref="addSysApiRuleFormRef">
      <el-form-item label="路径" :label-width="addSysApiFormLabelWidth" prop="api">
        <el-input v-model="addSysApiFormData.api" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="备注" :label-width="addSysApiFormLabelWidth" prop="description">
        <el-input v-model="addSysApiFormData.description" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="父路径" :label-width="addSysApiFormLabelWidth" prop="sysApiBasePathId">
        <el-select v-model="addSysApiFormData.sysApiBasePathId" style="width: 200px" prop="sysApiBasePathId" clearable>
          <el-option
              v-for="item in treeData"
              :label="item.basePath"
              :value="item.id"
              clearable
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogAddSysApiVisible = false">取消</el-button>
        <el-button type="primary" @click="onAddSysApiSubmit">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogUpdateSysApiVisible" title="修改接口" width="500" destroy-on-close :close-on-click-modal="false">
    <el-form :model="updateSysApiFormData" style="margin-left: 60px" :rules="updateSysApiRules" ref="updateSysApiRuleFormRef">
      <el-form-item label="路径" :label-width="updateSysApiFormLabelWidth" prop="">
        <el-input v-model="updateSysApiFormData.api" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="备注" :label-width="updateSysApiFormLabelWidth" prop="description">
        <el-input v-model="updateSysApiFormData.description" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="父路径" :label-width="updateSysApiFormLabelWidth" prop="sysApiBasePathId">
        <el-select v-model="updateSysApiFormData.sysApiBasePathId" style="width: 200px" prop="sysApiBasePathId" clearable>
          <el-option
              v-for="item in treeData"
              :label="item.basePath"
              :value="item.id"
              clearable
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogUpdateSysApiVisible = false">取消</el-button>
        <el-button type="primary" @click="onUpdateSysApiSubmit">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import {ElForm, ElMessage, ElMessageBox, ElTable} from 'element-plus'
import sysApi from '../../api/sys/sysApi.js'
import sysApiBasePath from '../../api/sys/sysApiBasePath.js'

const treeData = ref([]);
const refListTree = ref()
const defaultProps = {
  children: 'sysApiDTOList',
  label: 'api',
}
const fetchData = async() => {
  const sysApiBasePathList = await sysApiBasePath.listWithApiList();
  sysApiBasePathList.data.forEach(item => {
    item.api = item.basePath;
  })
  treeData.value = sysApiBasePathList.data;
}
const onAddSysApiBasePathDisabled = ref(true);
const onAddSysApiDisabled = ref(true);
const onDeleteDisabled = ref(true);
const onUpdateDisabled = ref(true);
onMounted(() => {
  const funNameListAuthorizedStr = sessionStorage.getItem("funNameListAuthorized");
  if(funNameListAuthorizedStr!=null && funNameListAuthorizedStr!=''){
    const funNameListAuthorized = JSON.parse(funNameListAuthorizedStr);
    funNameListAuthorized.forEach(item =>{
      switch (item) {
        case '新增父路径':
          onAddSysApiBasePathDisabled.value = false;
          break;
        case '新增接口':
          onAddSysApiDisabled.value = false;
          break;
        case '删除':
          onDeleteDisabled.value = false;
          break;
        case '修改':
          onUpdateDisabled.value = false;
          break;
      }
    })
  }
  fetchData()
})
const dialogAddSysApiBasePathVisible = ref(false);
const dialogUpdateSysApiBasePathVisible = ref(false);
const dialogAddSysApiVisible = ref(false);
const dialogUpdateSysApiVisible = ref(false);
const addSysApiBasePathFormLabelWidth = ref('100px');
const updateSysApiBasePathFormLabelWidth = ref('100px');
const addSysApiFormLabelWidth = ref('80px');
const updateSysApiFormLabelWidth = ref('80px');
const addSysApiBasePathRuleFormRef = ref();
const addSysApiBasePathRules = reactive({
  basePath: [{ required: true, message: "请输入父路径名称", trigger: "blur" }],
});
const updateSysApiBasePathRuleFormRef = ref();
const updateSysApiBasePathRules = reactive({
  basePath: [{ required: true, message: "请输入父路径名称", trigger: "blur" }],
});
const addSysApiRuleFormRef = ref();
const addSysApiRules = reactive({
  api: [{ required: true, message: "请输入路径", trigger: "blur" }],
  sysApiBasePathId: [{ required: true, message: "请选择父路径", trigger: "blur" }],
});
const updateSysApiRuleFormRef = ref();
const updateSysApiRules = reactive({
  api: [{ required: true, message: "请输入路径", trigger: "blur" }],
  sysApiBasePathId: [{ required: true, message: "请选择父路径", trigger: "blur" }],
});
const addSysApiBasePathFormData = ref({
  basePath: null,
  description: null,
});
const updateSysApiBasePathFormData = ref({
  basePath: null,
  description: null,
});
const addSysApiFormData = ref({
  api: null,
  description: null,
  sysApiBasePathId: null,
});
const updateSysApiFormData = ref();
const onAddSysApiBasePath = () => {
  addSysApiBasePathFormData.value = {
    basePath: null,
    description: null,
  }
  dialogAddSysApiBasePathVisible.value = true;
};
const onAddSysApi = () => {
  addSysApiFormData.value = {
    api: null,
    description: null,
    sysApiBasePathId: null,
  }
  dialogAddSysApiVisible.value = true;
};
const onUpdate= (data) => {
  if (data.sysApiBasePathId) {
    updateSysApiFormData.value = {...data};
    dialogUpdateSysApiVisible.value = true;
  } else {
    updateSysApiBasePathFormData.value = {...data};
    dialogUpdateSysApiBasePathVisible.value = true;
  }
};
const onDelete = () => {
  const checkedNodes = refListTree.value.getCheckedNodes();
  if(checkedNodes.length == 0){
    ElMessage.warning('请选择数据');
    return;
  }
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const sysApiBasePathList = new Array();
    const sysApiList = new Array();
    checkedNodes.forEach(item => {
      if (item.sysApiBasePathId) {
        sysApiList.push(item.id);
      } else {
        sysApiBasePathList.push(item.id);
      }
    })
    if(sysApiBasePathList.length > 0){
      sysApiBasePath.batchDelete({'idList':sysApiBasePathList}).then(() => {
        fetchData();
      });
    }
    if(sysApiList.length > 0){
      sysApi.batchDelete({'idList':sysApiList}).then(() => {
        fetchData();
      });
    }
    ElMessage.success('删除成功');
  }).catch(() => {
  });
}
const onAddSysApiBasePathSubmit = () => {
  addSysApiBasePathRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await sysApiBasePath.add(addSysApiBasePathFormData.value);
      ElMessage.success("新增成功");
      dialogAddSysApiBasePathVisible.value = false;
      fetchData();
    } else {
      return false;
    }
  });
};
const onUpdateSysApiBasePathSubmit = () => {
  updateSysApiBasePathRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await sysApiBasePath.update(updateSysApiBasePathFormData.value);
      ElMessage.success("修改成功");
      dialogUpdateSysApiBasePathVisible.value = false;
      fetchData();
    } else {
      return false;
    }
  });
};
const onAddSysApiSubmit = () => {
  addSysApiRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await sysApi.add(addSysApiFormData.value);
      ElMessage.success("新增成功");
      dialogAddSysApiVisible.value = false;
      fetchData();
    } else {
      return false;
    }
  });
};
const onUpdateSysApiSubmit = () => {
  updateSysApiRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await sysApi.update(updateSysApiFormData.value);
      ElMessage.success("修改成功");
      dialogUpdateSysApiVisible.value = false;
      fetchData();
    } else {
      return false;
    }
  });
};
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
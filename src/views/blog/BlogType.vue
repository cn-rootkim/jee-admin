<template>
  <el-main style="text-align: left;">
    <div>
      <el-button @click="onAdd" :disabled="onAddDisabled">新增</el-button>
      <el-button @click="onDelete" type="danger" :disabled="onDeleteDisabled">删除</el-button>
    </div>
    <el-tree
        ref="refListTree"
        style="width: 40%; float: left; margin-top: 10px;"
        :data="blogTypeData"
        show-checkbox
        node-key="id"
        :props="defaultProps"
    >
      <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button style="margin-left: 8px" @click="onUpdate(data)" size="small" :disabled="onUpdateDisabled">修改</el-button>
            </span>
          </span>
      </template>
    </el-tree>
    <el-dialog v-model="dialogAddVisible" title="新增" width="500" destroy-on-close :close-on-click-modal="false">
      <el-form :model="addFormData" style="margin-left: 60px" :rules="addRules" ref="addRuleFormRef">
        <el-form-item label="分类名称" :label-width="addFormLabelWidth" prop="name">
          <el-input v-model="addFormData.name" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="父级分类" :label-width="addFormLabelWidth">
          <el-tree-select
              v-model="addFormData.parentId"
              :data="blogTypeData"
              check-strictly
              :render-after-expand="false"
              :props="defaultProps"
              style="width: 200px"
              clearable
          />
        </el-form-item>
        <el-form-item label="排序数字" :label-width="addFormLabelWidth" prop="sortNum">
          <el-input-number v-model="addFormData.sortNum" :min="0" controls-position="right"/>
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
        <el-form-item label="分类名称" :label-width="updateFormLabelWidth" prop="name">
          <el-input v-model="updateFormData.name" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="父级分类" :label-width="updateFormLabelWidth">
          <el-tree-select
              v-model="updateFormData.parentId"
              :data="blogTypeData"
              check-strictly
              :render-after-expand="false"
              :props="defaultProps"
              style="width: 200px"
              clearable
          />
        </el-form-item>
        <el-form-item label="排序数字" :label-width="updateFormLabelWidth" prop="sortNum">
          <el-input-number v-model="updateFormData.sortNum" :min="0" controls-position="right"/>
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
  </el-main>
</template>
<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import blogTypeApi from "../../api/blog/blogType";
import {ElForm, ElMessage, ElMessageBox, ElTable} from 'element-plus'
const defaultProps = {
  children: 'childList',
  label: 'name',
  value: 'id'
}
const blogTypeData = ref([]);
const tableData = ref([]);
const fetchBlogTypeData = async () => {
  const listTree = await blogTypeApi.listTree();
  blogTypeData.value = listTree.data;
};
const onAddDisabled = ref(true);
const onDeleteDisabled = ref(true);
const onUpdateDisabled = ref(true);
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
        }
      }
    })
  }
  fetchBlogTypeData();
});
const dialogAddVisible = ref(false);
const dialogUpdateVisible = ref(false);
const addFormLabelWidth = ref('80px');
const updateFormLabelWidth = ref('80px');
const addRuleFormRef = ref();
const addRules = reactive({
  name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
});
const updateRuleFormRef = ref();
const updateRules = reactive({
  name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
});
const addFormData = ref({
  name: null,
  parentId: null,
  sortNum: 0,
});
const updateFormData = ref({
  name: null,
  parentId: null,
  sortNum: 0,
});
const onAdd = () => {
  addFormData.value = {
    name: null,
    parentId: null,
    sortNum: 0,
  }
  dialogAddVisible.value = true;
};
const onUpdate = (data) => {
  updateFormData.value = {...data};
  dialogUpdateVisible.value = true;
};
const onAddSubmit = () => {
  addRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await blogTypeApi.add(addFormData.value);
      ElMessage.success("新增成功");
      dialogAddVisible.value = false;
      await fetchBlogTypeData();
      tableData.value = null;
    } else {
      return false;
    }
  });
};
const onUpdateSubmit = () => {
  updateRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await blogTypeApi.update(updateFormData.value);
      ElMessage.success("修改成功");
      dialogUpdateVisible.value = false;
      await fetchBlogTypeData();
      tableData.value = null;
    } else {
      return false;
    }
  });
};
const refListTree = ref();
const onDelete = () => {
  const idList = refListTree.value.getCheckedKeys();
  if(idList.length == 0){
    ElMessage.warning('请选择数据');
    return;
  }
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    blogTypeApi.batchDelete({idList: idList}).then((res) => {
      ElMessage.success('删除成功');
      fetchBlogTypeData();
      tableData.value = null;
    });
  }).catch(() => {
  });
}
</script>
<style scoped>
</style>
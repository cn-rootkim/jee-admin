<template>
  <el-main>
    <el-form :inline="true" style="text-align: left;" :model="formData" ref="formRef" >
      <el-form-item label="标题">
        <el-input clearable v-model="formData.title" style="width: 170px;"/>
      </el-form-item>
      <el-form-item label="内容">
        <el-input clearable v-model="formData.content" style="width: 170px;"/>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-select clearable  style="width: 170px;" v-model="formData.isShow">
          <el-option label="显示" value="0" />
          <el-option label="隐藏" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-tree-select
            v-model="formData.blogTypeId"
            :data="blogTypeTreeData"
            :render-after-expand="false"
            :props="defaultProps"
            style="width: 170px"
            clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 10px; text-align: left;">
      <el-button @click="onAdd" :disabled="onAddDisabled">新增</el-button>
      <el-button @click="onDelete" type="danger" :disabled="onDeleteDisabled">删除</el-button>
      <el-button @click="onUpdate" :disabled="onUpdateDisabled">修改</el-button>
    </div>
    <el-table
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="title" label="标题" width="220" />
      <el-table-column property="sortNum" label="排序数字"/>
      <el-table-column property="isShow" label="是否显示"/>
      <el-table-column property="createTime" label="创建时间" />
      <el-table-column property="createrName" label="创建人" />
      <el-table-column property="updateTime" label="修改时间"/>
      <el-table-column property="updaterName" label="修改人" />
    </el-table>
    <el-pagination style="margin-top: 10px;" :current-page="currentPage" :page-size="pageSize"
                   background layout="total, prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange"/>

    <el-dialog v-model="dialogAddVisible" title="新增" width="55%" destroy-on-close :close-on-click-modal="false">
      <el-form :model="addFormData" style="margin-left: 60px" :rules="addRules" ref="addRuleFormRef" label-position="left">
        <el-form-item label="标题" :label-width="addFormLabelWidth" prop="title">
          <el-input v-model="addFormData.title" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="排序数字" :label-width="addFormLabelWidth" prop="sortNum">
          <el-input-number v-model="addFormData.sortNum" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否显示" :label-width="addFormLabelWidth" prop="isShow">
          <el-select clearable style="width: 170px;" v-model="addFormData.isShow">
            <el-option label="显示" value="0" />
            <el-option label="隐藏" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" :label-width="addFormLabelWidth" prop="blogTypeIdList">
          <el-tree-select
              v-model="addFormData.blogTypeIdList"
              :data="blogTypeTreeData"
              :render-after-expand="false"
              :props="defaultProps"
              style="width: 200px"
              clearable
              multiple
          />
        </el-form-item>
        <el-form-item label="内容" :label-width="addFormLabelWidth" prop="content">
          <div style="width: 100%;">
            <QuillEditor theme="snow" ref="myQuillEditor" style="height: 200px; width: 100%;" :options="editorOption"/>
          </div>
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
    <el-dialog v-model="dialogUpdateVisible" title="修改" width="55%" destroy-on-close :close-on-click-modal="false">
      <el-form :model="updateFormData" style="margin-left: 60px" :rules="updateRules" ref="updateRuleFormRef">
        <el-form-item label="标题" :label-width="updateFormLabelWidth" prop="title">
          <el-input v-model="updateFormData.title" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="排序数字" :label-width="updateFormLabelWidth" prop="sortNum">
          <el-input-number v-model="updateFormData.sortNum" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否显示" :label-width="updateFormLabelWidth" prop="isShow">
          <el-select clearable style="width: 170px;" v-model="updateFormData.isShow">
            <el-option label="显示" value="0" />
            <el-option label="隐藏" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" :label-width="updateFormLabelWidth" prop="blogTypeIdList">
          <el-tree-select
              v-model="updateFormData.blogTypeIdList"
              :data="blogTypeTreeData"
              :render-after-expand="false"
              :props="defaultProps"
              style="width: 200px"
              clearable
              multiple
          />
        </el-form-item>
        <el-form-item label="内容" :label-width="updateFormLabelWidth" prop="content">
          <div style="width: 100%;">
            <QuillEditor theme="snow" ref="myQuillEditor" :options="editorOption" style="height: 200px; width: 100%;"/>
          </div>
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
import { ElTable,ElForm,ElMessage,ElMessageBox } from 'element-plus'
import blogApi from "../../api/blog/blog.js";
import blogTypeApi from "../../api/blog/blogType.js";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const myQuillEditor = ref();
const editorOption =reactive({
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike','clean'],
      ["blockquote", "code-block"], //引用，代码块
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'header': 1 }, { 'header': 2 }],
      ['image'],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }]
    ]
  }
});
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref([]);
const tableData =ref();
const formData = ref({
  title: null,
  content: null,
  isShow: null,
  blogTypeId: null
});
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogAddVisible = ref(false);
const dialogUpdateVisible = ref(false);
const addFormLabelWidth = ref('80px');
const updateFormLabelWidth = ref('80px');
const addRuleFormRef = ref();
const validatorAddContent = (rule: any, value: any, callback: any) =>{
  addFormData.value.content = myQuillEditor.value.getHTML();
  if(addFormData.value.content == null || addFormData.value.content == ''){
    callback(new Error('请输入内容'))
  }else{
    callback()
  }
}
const validatorUpdateContent = (rule: any, value: any, callback: any) =>{
  updateFormData.value.content = myQuillEditor.value.getHTML();
  if(updateFormData.value.content == null || updateFormData.value.content == ''){
    callback(new Error('请输入内容'))
  }else{
    callback()
  }
}
const addRules = reactive({
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  content: [{required: true, validator: validatorAddContent, trigger: "blur" }],
  isShow: [{ required: true, message: "请选择是否显示", trigger: "blur" }],
  blogTypeIdList: [{ required: true, message: "请选择分类", trigger: "blur" }],
});
const updateRuleFormRef = ref();
const updateRules = reactive({
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  content: [{ required: true, validator: validatorUpdateContent, trigger: "blur" }],
  isShow: [{ required: true, message: "请选择是否显示", trigger: "blur" }],
  blogTypeIdList: [{ required: true, message: "请选择分类", trigger: "blur" }],
});
const addFormData = ref({
  title: null,
  content: null,
  sortNum: 0,
  isShow: '0',
  blogTypeIdList: null
});
const updateFormData = ref({
  id: null,
  title: null,
  content: null,
  sortNum: 0,
  isShow: null,
  blogTypeIdList: null
});
const handleSelectionChange = (val: []) => {
  multipleSelection.value = val
}
const fetchListData = async (current:number) => {
  const data = formData.value;
  data.current = current;
  data.size = pageSize.value;
  const listData = await blogApi.page(data);
  total.value = listData.data.total;
  currentPage.value = current;
  tableData.value = await listData.data.records;
  tableData.value.forEach(item => {
    item.isShow = item.isShow == '0' ? '显示' : '隐藏';
  });
}
const defaultProps = {
  children: 'childList',
  label: 'name',
  value: 'id'
}
const blogTypeTreeData = ref(null);
const fetchBlogTypeTreeData = async () => {
  const listTree = await blogTypeApi.listTree();
  blogTypeTreeData.value = listTree.data;
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
  fetchListData(1);
  fetchBlogTypeTreeData();
});
const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchListData(val);
}

const onSubmit = () => {
  fetchListData(1);
}
const onAdd = () => {
  addFormData.value = {
    title: null,
    content: null,
    sortNum: 0,
    isShow: '0',
    blogTypeIdList: null
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
  const info = await blogApi.info({id:multipleSelection.value[0].id});
  dialogUpdateVisible.value = true;
  updateFormData.value = {...info.data};
  updateFormData.value.isShow = info.data.isShow.toString();
  setTimeout(() => {
    myQuillEditor.value.setHTML(info.data.content);
  }, 100);
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
    blogApi.batchDelete({idList: multipleSelection.value.map(item => item.id)}).then((res) => {
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
      blogApi.add(addFormData.value).then((res) => {
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
      blogApi.update(updateFormData.value).then((res) => {
        ElMessage.success('修改成功');
        dialogUpdateVisible.value = false;
        fetchListData(1);
      });
    } else {
      return false;
    }
  });
}
</script>
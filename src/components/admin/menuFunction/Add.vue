<script setup lang="ts">
import {ElForm, ElMessage} from "element-plus";
import {ref, defineProps, reactive, defineEmits} from 'vue';
import adminMenuFunctionApi from "../../../api/admin/adminMenuFunction";

type HeaderProps = {
  dialogAddFunctionVisible: boolean,
  addFunctionFormData: any,
  adminMenuData: any
};
const props = defineProps<HeaderProps>();
const emit = defineEmits(['myEvent'])
const defaultProps = {
  children: 'childList',
  label: 'name',
  value: 'id'
}
const addFunctionFormLabelWidth = ref('80px');
const addFunctionRuleFormRef = ref();
const addFunctionRules = reactive({
  name: [{required: true, message: "请输入功能名称", trigger: "blur"}],
  adminMenuId: [{required: true, message: "请选择归属菜单", trigger: "blur"}],
});
const onAddFunctionSubmit = () => {
  addFunctionRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await adminMenuFunctionApi.add(props.addFunctionFormData);
      ElMessage.success("新增成功");
      emit("success");
    } else {
      return false;
    }
  });
};
</script>

<template>
  <el-dialog v-model="props.dialogAddFunctionVisible" title="新增功能" width="500" destroy-on-close
             :close-on-click-modal="false">
    <el-form :model="props.addFunctionFormData" style="margin-left: 60px" :rules="addFunctionRules"
             ref="addFunctionRuleFormRef">
      <el-form-item label="功能名称" :label-width="addFunctionFormLabelWidth" prop="name">
        <el-input v-model="props.addFunctionFormData.name" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="归属菜单" :label-width="addFunctionFormLabelWidth" prop="adminMenuId">
        <el-tree-select
            v-model="props.addFunctionFormData.adminMenuId"
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
</template>

<style scoped>

</style>
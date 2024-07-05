<script setup lang="ts">
import {ElForm, ElMessage} from "element-plus";
import {ref, defineProps, reactive, defineEmits} from 'vue';
import adminMenuFunctionApi from "../../../api/admin/adminMenuFunction";

type HeaderProps = {
  dialogUpdateFunctionVisible: boolean,
  updateFunctionFormData: any,
  adminMenuData: any
};
const props = defineProps<HeaderProps>();
const emit = defineEmits(['myEvent'])
const defaultProps = {
  children: 'childList',
  label: 'name',
  value: 'id'
}
const updateFunctionFormLabelWidth = ref('80px');
const updateFunctionRuleFormRef = ref();
const updateFunctionRules = reactive({
  name: [{required: true, message: "请输入功能名称", trigger: "blur"}],
  adminMenuId: [{required: true, message: "请选择归属菜单", trigger: "blur"}],
});
const onUpdateFunctionSubmit = () => {
  updateFunctionRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await adminMenuFunctionApi.update(props.updateFunctionFormData);
      ElMessage.success("修改成功");
      emit("success");
    } else {
      return false;
    }
  });
};
</script>

<template>
  <el-dialog v-model="props.dialogUpdateFunctionVisible" title="修改功能" width="500" destroy-on-close
             :close-on-click-modal="false">
    <el-form :model="props.updateFunctionFormData" style="margin-left: 60px" :rules="updateFunctionRules"
             ref="updateFunctionRuleFormRef">
      <el-form-item label="功能名称" :label-width="updateFunctionFormLabelWidth" prop="name">
        <el-input v-model="props.updateFunctionFormData.name" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="归属菜单" :label-width="updateFunctionFormLabelWidth" prop="adminMenuId">
        <el-tree-select
            v-model="props.updateFunctionFormData.adminMenuId"
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
</template>

<style scoped>

</style>
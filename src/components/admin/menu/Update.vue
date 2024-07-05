<script setup lang="ts">
import {ElForm, ElMessage} from "element-plus";
import {ref, defineProps, reactive, defineEmits} from 'vue';
import adminMenuApi from "../../../api/admin/adminMenu.js";

type HeaderProps = {
  dialogUpdateMenuVisible: boolean,
  updateMenuFormData: any,
  adminMenuData: any
};
const props = defineProps<HeaderProps>();
const emit = defineEmits(['myEvent'])

const updateMenuFormLabelWidth = ref('80px');
const updateMenuRuleFormRef = ref();
const updateMenuRules = reactive({
  name: [{required: true, message: "请输入菜单名称", trigger: "blur"}],
  path: [{required: true, message: "请输入菜单路径", trigger: "blur"}],
  parentId: [{required: true, message: "请选择父级菜单", trigger: "blur"}],
});
const defaultProps = {
  children: 'childList',
  label: 'name',
  value: 'id'
}

const onUpdateMenuSubmit = () => {
  updateMenuRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await adminMenuApi.update(props.updateMenuFormData);
      ElMessage.success("修改成功");
      emit("success");
    } else {
      return false;
    }
  });
};
</script>

<template>
  <el-dialog v-model="props.dialogUpdateMenuVisible" title="修改菜单" width="500" destroy-on-close
             :close-on-click-modal="false">
    <el-form :model="props.updateMenuFormData" style="margin-left: 60px" :rules="updateMenuRules"
             ref="updateMenuRuleFormRef">
      <el-form-item label="菜单名称" :label-width="updateMenuFormLabelWidth" prop="name">
        <el-input v-model="props.updateMenuFormData.name" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="菜单路径" :label-width="updateMenuFormLabelWidth">
        <el-input v-model="props.updateMenuFormData.path" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="父级菜单" :label-width="updateMenuFormLabelWidth">
        <el-tree-select
            v-model="props.updateMenuFormData.parentId"
            :data="props.adminMenuData"
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
</template>

<style scoped>

</style>
<script setup lang="ts">
import {ElForm, ElMessage} from "element-plus";
import {ref, defineProps, reactive, defineEmits} from 'vue';
import adminMenuApi from "../../../api/admin/adminMenu.js";

type HeaderProps = {
  dialogAddMenuVisible: boolean,
  addMenuFormData: any,
  adminMenuData: any
};
const props = defineProps<HeaderProps>();
const emit = defineEmits(['myEvent'])
const addMenuRules = reactive({
  name: [{required: true, message: "请输入菜单名称", trigger: "blur"}],
  path: [{required: true, message: "请输入菜单路径", trigger: "blur"}],
  parentId: [{required: true, message: "请选择父级菜单", trigger: "blur"}],
});
const addMenuFormLabelWidth = ref('80px');
const addMenuRuleFormRef = ref();
const defaultProps = {
  children: 'childList',
  label: 'name',
  value: 'id'
}
const onAddMenuSubmit = () => {
  addMenuRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await adminMenuApi.add(props.addMenuFormData);
      ElMessage.success("新增成功");
      emit("success");
    } else {
      return false;
    }
  });
};
</script>

<template>
  <el-dialog v-model="props.dialogAddMenuVisible" title="新增菜单" width="500" destroy-on-close
             :close-on-click-modal="false">
    <el-form :model="props.addMenuFormData" style="margin-left: 60px" :rules="addMenuRules" ref="addMenuRuleFormRef">
      <el-form-item label="菜单名称" :label-width="addMenuFormLabelWidth" prop="name">
        <el-input v-model="props.addMenuFormData.name" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="菜单路径" :label-width="addMenuFormLabelWidth">
        <el-input v-model="props.addMenuFormData.path" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="父级菜单" :label-width="addMenuFormLabelWidth">
        <el-tree-select
            v-model="props.addMenuFormData.parentId"
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
        <el-button @click="dialogAddMenuVisible = false">取消</el-button>
        <el-button type="primary" @click="onAddMenuSubmit">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
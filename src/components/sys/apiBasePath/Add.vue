<script setup lang="ts">
import {ElForm, ElMessage} from "element-plus";
import {ref, defineProps, reactive, defineEmits} from 'vue';
import sysApiBasePath from '../../../api/sys/sysApiBasePath.js'

type HeaderProps = {
  dialogAddSysApiBasePathVisible: boolean,
  addSysApiBasePathFormData: any
};
const props = defineProps<HeaderProps>();
const emit = defineEmits(['myEvent'])
const addSysApiBasePathRules = reactive({
  basePath: [{ required: true, message: "请输入父路径名称", trigger: "blur" }],
});
const addSysApiBasePathFormLabelWidth = ref('100px');
const addSysApiBasePathRuleFormRef = ref();
const onAddSysApiBasePathSubmit = () => {
  addSysApiBasePathRuleFormRef.value.validate(async (valid) => {
    if (valid) {
      await sysApiBasePath.add(props.addSysApiBasePathFormData.value);
      ElMessage.success("新增成功");
      emit("success");
    } else {
      return false;
    }
  });
};
</script>

<template>
  <el-dialog v-model="props.dialogAddSysApiBasePathVisible" title="新增父路径" width="500" destroy-on-close :close-on-click-modal="false">
    <el-form :model="props.addSysApiBasePathFormData" style="margin-left: 60px" :rules="addSysApiBasePathRules" ref="addSysApiBasePathRuleFormRef">
      <el-form-item label="父路径名称" :label-width="addSysApiBasePathFormLabelWidth" prop="basePath">
        <el-input v-model="props.addSysApiBasePathFormData.basePath" autocomplete="off" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="备注" :label-width="addSysApiBasePathFormLabelWidth" prop="description">
        <el-input v-model="props.addSysApiBasePathFormData.description" autocomplete="off" style="width: 200px;"/>
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
</template>

<style scoped>

</style>
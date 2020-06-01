<template>
  <div class="s1-crud">
    <div v-if="$slots.header" class="s1-crud-header">
      <slot name="header" />
    </div>
    <div class="s1-crud-body">
      <el-table
        ref="elTable"
        v-loading="loading"
        v-bind="options"
        :data="s1CrudData"
        :border="options ? handleAttribute(options.border, true) : true"
        :highlight-current-row="options ? handleAttribute(options.highlightCurrentRow, true) : true"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <el-table-column
          v-if="selectionRow || selectionRow === ''"
          type="selection"
          v-bind="selectionRow"
          :width="handleAttribute(selectionRow.width, 40)"
          :align="handleAttribute(selectionRow.align, 'center')"
        />
        <el-table-column
          v-if="indexRow || indexRow === ''"
          type="index"
          v-bind="indexRow"
          :width="handleAttribute(indexRow.width, 50)"
          :align="handleAttribute(indexRow.align, 'center')"
        />
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          v-bind="item"
          :prop="handleAttribute(item.prop, null)"
          :align="handleAttribute(item.align, 'center')"
        >
          <template slot-scope="scope">
            <render-custom-component
              v-if="item.component && item.component.name"
              v-model="scope.row[item.prop]"
              :component-name="item.component.name"
              :props="item.component.props ? item.component.props : null"
              :scope="scope"
            />
            <template v-else>{{ item.formatter ? item.formatter(scope.row, scope.column, _get(scope.row, item.prop), scope.$index) : _get(scope.row, item.prop) }}</template>
          </template>
        </el-table-column>
        <el-table-column
          v-if="rowHandle"
          v-bind="rowHandle"
          :label="handleAttribute(rowHandle.columnHeader, '操作')"
          :align="handleAttribute(rowHandle.align, 'center')"
        >
          <template slot-scope="scope">
            <slot :scope="scope" name="button-left" />
            <template>
              <el-button
                v-if="rowHandle.edit && rowHandle.edit.text && handleButtonShow(rowHandle.edit.show, scope.$index, scope.row)"
                v-bind="rowHandle.edit"
                :type="handleAttribute(rowHandle.edit.type, 'primary')"
                :size="handleAttribute(rowHandle.edit.size, 'mini')"
                :disabled="handleButtonDisabled(rowHandle.edit.disabled, scope.$index, scope.row)"
                :icon="handleAttribute(rowHandle.edit.icon, 'el-icon-edit')"
                @click="handleEdit(scope.$index, scope.row)"
              >{{ handleAttribute(rowHandle.edit.text, '编辑') }}</el-button>
              <el-button
                v-if="rowHandle.edit && !rowHandle.edit.text && handleButtonShow(rowHandle.edit.show, scope.$index, scope.row)"
                v-bind="rowHandle.edit"
                :type="handleAttribute(rowHandle.edit.type, 'primary')"
                :size="handleAttribute(rowHandle.edit.size, 'mini')"
                :disabled="handleButtonDisabled(rowHandle.edit.disabled, scope.$index, scope.row)"
                :icon="handleAttribute(rowHandle.edit.icon, 'el-icon-edit')"
                @click="handleEdit(scope.$index, scope.row)"
              />
            </template>
            <template>
              <el-button
                v-if="rowHandle.remove.text"
                v-bind="rowHandle.remove"
                :type="handleAttribute(rowHandle.remove.type, 'danger')"
                :size="handleAttribute(rowHandle.remove.size, 'mini')"
                :disabled="handleButtonDisabled(rowHandle.remove.disabled, scope.$index, scope.row)"
                :icon="handleAttribute(rowHandle.remove.icon, 'el-icon-delete')"
                @click="handleRemove(scope.$index, scope.row)"
              >{{ handleAttribute(rowHandle.remove.text, '删除') }}</el-button>
              <el-button
                v-if="!rowHandle.remove.text"
                v-bind="rowHandle.remove"
                :type="handleAttribute(rowHandle.remove.type, 'danger')"
                :size="handleAttribute(rowHandle.remove.size, 'mini')"
                :disabled="handleButtonDisabled(rowHandle.remove.disabled, scope.$index, scope.row)"
                :icon="handleAttribute(rowHandle.remove.icon, 'el-icon-delete')"
                @click="handleRemove(scope.$index, scope.row)"
              />
            </template>
            <template v-for="(item, index) in handleAttribute(rowHandle.custom, [])">
              <el-button
                v-if="item.text && handleButtonShow(item.show, scope.$index, scope.row)"
                :key="index"
                v-bind="item"
                :size="handleAttribute(rowHandle.edit.size, 'mini')"
                :disabled="handleButtonDisabled(item.disabled, scope.$index, scope.row)"
                @click="$emit(item.emit, {index: scope.$index, row: scope.row})"
              >{{ item.text }}</el-button>
              <el-button
                v-if="!item.text && handleButtonShow(item.show, scope.$index, scope.row)"
                :key="index"
                v-bind="item"
                :size="handleAttribute(rowHandle.edit.size, 'mini')"
                :disabled="handleButtonDisabled(item.disabled, scope.$index, scope.row)"
                @click="$emit(item.emit, {index: scope.$index, row: scope.row})"
              />
            </template>
            <slot :scope="scope" name="button-right" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="pagination" class="s1-crud-pagination">
      <el-pagination
        v-bind="pagination"
        :background="handleAttribute(pagination.background, true)"
        :page-size.sync="pageSize"
        :current-page.sync="currentPage"
        :page-sizes="handleAttribute(pagination.pageSizes, [10, 20, 30, 50, 100])"
        @size-change="handlePaginationSizeChange"
        @current-change="handlePaginationCurrentChange"
      />
    </div>
    <el-dialog
      v-if="isDialogShow"
      v-bind="formOptions"
      :title="formMode === 'edit' ? editTitle : addTitle"
      :visible.sync="isDialogShow"
      :before-close="handleCloseDialog"
    >
      <el-form
        ref="form"
        v-bind="formOptions"
        :model="formData"
        :rules="handleFormRulesMode()"
      >
        <el-row v-bind="formOptions">
          <template v-for="(value, key, index) in formData">
            <el-col
              v-if="handleFormTemplateMode(key).component ? handleAttribute(handleFormTemplateMode(key).component.show, true) : true"
              :key="index"
              :span="handleFormTemplateMode(key).component ? handleAttribute(handleFormTemplateMode(key).component.span, 24) : 24"
              :offset="handleFormTemplateMode(key).component ? handleAttribute(handleFormTemplateMode(key).component.offset, 0) : 0"
            >
              <el-form-item
                :label="handleFormTemplateMode(key).label"
                :prop="key"
              >
                <slot :name="key" :value="value" :row="editDataStorage">
                  <el-input
                    v-if="!handleFormTemplateMode(key).component || !handleFormTemplateMode(key).component.name || handleFormTemplateMode(key).component.name === 'el-input'"
                    v-model="formData[key]"
                    v-bind="handleFormTemplateMode(key).component"
                    :maxlength="handleAttribute(handleFormTemplateMode(key).component ? handleFormTemplateMode(key).component.maxlength : 255, 255)"
                    :clearable="handleAttribute(handleFormTemplateMode(key).component ? handleFormTemplateMode(key).component.clearable : true, true)"
                    @change="$emit('form-data-change', { key, value })"
                  >
                    <template
                      v-if="handleFormTemplateMode(key).component && handleFormTemplateMode(key).component.prepend"
                      slot="prepend"
                    >{{ handleFormTemplateMode(key).component.prepend }}</template>
                    <template
                      v-if="handleFormTemplateMode(key).component && handleFormTemplateMode(key).component.append"
                      slot="append"
                    >{{ handleFormTemplateMode(key).component.append }}</template>
                  </el-input>
                  <template v-else-if="handleFormTemplateMode(key).component.name === 'el-input-number'">
                    <el-input-number
                      v-model="formData[key]"
                      v-bind="handleFormTemplateMode(key).component"
                      :min="handleAttribute(handleFormTemplateMode(key).component.min, 0)"
                      :controls-position="handleAttribute(handleFormTemplateMode(key).component.controlsPosition, 'right')"
                      @change="$emit('form-data-change', { key, value })"
                    />
                    <el-tag
                      v-if="handleFormTemplateMode(key).component.tag"
                      :type="handleAttribute(handleFormTemplateMode(key).component.tagType, 'danger')"
                    >{{ handleFormTemplateMode(key).component.tag }}</el-tag>
                  </template>
                  <el-radio-group
                    v-else-if="handleFormTemplateMode(key).component.name === 'el-radio'"
                    v-model="formData[key]"
                    v-bind="handleFormTemplateMode(key).component"
                    @change="$emit('form-data-change', { key, value })"
                  >
                    <template v-if="handleFormTemplateMode(key).component.buttonMode">
                      <el-radio-button
                        v-for="option in handleFormTemplateMode(key).component.options"
                        :key="option.value"
                        :disabled="option.disabled"
                        :label="option.value"
                      >{{ option.label }}</el-radio-button>
                    </template>
                    <template v-else>
                      <el-radio
                        v-for="option in handleFormTemplateMode(key).component.source ? sourceOptions[key] : handleFormTemplateMode(key).component.options"
                        :key="option.value"
                        :disabled="option.disabled"
                        :label="option.value"
                      >{{ option.label }}</el-radio>
                    </template>
                  </el-radio-group>
                  <el-checkbox-group
                    v-else-if="handleFormTemplateMode(key).component.name === 'el-checkbox'"
                    v-model="formData[key]"
                    v-bind="handleFormTemplateMode(key).component"
                    @change="$emit('form-data-change', { key, value })"
                  >
                    <template v-if="handleFormTemplateMode(key).component.buttonMode">
                      <el-checkbox-button
                        v-for="option in handleFormTemplateMode(key).component.source ? sourceOptions[key] : handleFormTemplateMode(key).component.options"
                        :key="option.value"
                        :label="option.value"
                      >{{ option.label }}</el-checkbox-button>
                    </template>
                    <template v-else>
                      <el-checkbox
                        v-for="option in handleFormTemplateMode(key).component.source ? sourceOptions[key] : handleFormTemplateMode(key).component.options"
                        :key="option.value"
                        :label="option.value"
                      >{{ option.label }}</el-checkbox>
                    </template>
                  </el-checkbox-group>
                  <el-select
                    v-else-if="handleFormTemplateMode(key).component.name === 'el-select'"
                    v-model="formData[key]"
                    v-bind="handleFormTemplateMode(key).component"
                    :clearable="handleAttribute(handleFormTemplateMode(key).component.clearable, true)"
                    :filterable="handleAttribute(handleFormTemplateMode(key).component.filterable, true)"
                    :remote-method="(query) => $emit('form-remote-method', { key, query })"
                    :style="handleAttribute(handleFormTemplateMode(key).component.style, 'width: 100%;')"
                    @change="$emit('form-data-change', { key, value })"
                  >
                    <el-option
                      v-for="option in handleFormTemplateMode(key).component.source ? sourceOptions[key] : handleFormTemplateMode(key).component.options"
                      :key="option.value"
                      v-bind="option"
                    />
                  </el-select>
                  <el-cascader
                    v-else-if="handleFormTemplateMode(key).component.name === 'el-cascader'"
                    v-model="formData[key]"
                    v-bind="handleFormTemplateMode(key).component"
                    :options="handleFormTemplateMode(key).component.source ? sourceOptions[key] : handleFormTemplateMode(key).component.options"
                    :clearable="handleAttribute(handleFormTemplateMode(key).component.clearable, true)"
                    :filterable="handleAttribute(handleFormTemplateMode(key).component.filterable, true)"
                    :style="handleAttribute(handleFormTemplateMode(key).component.style, 'width: 100%;')"
                    @change="$emit('form-data-change', { key, value })"
                  />
                  <el-switch
                    v-else-if="handleFormTemplateMode(key).component.name === 'el-switch'"
                    v-model="formData[key]"
                    v-bind="handleFormTemplateMode(key).component"
                    :active-color="handleAttribute(handleFormTemplateMode(key).component.activeColor, '#13ce66')"
                    :inactive-color="handleAttribute(handleFormTemplateMode(key).component.inactiveColor, '#ff4949')"
                    @change="$emit('form-data-change', { key, value })"
                  />
                  <el-date-picker
                    v-else-if="handleFormTemplateMode(key).component.name === 'el-date-picker'"
                    v-model="formData[key]"
                    v-bind="handleFormTemplateMode(key).component"
                    @change="$emit('form-data-change', { key, value })"
                  />
                  <el-rate
                    v-else-if="handleFormTemplateMode(key).component.name === 'el-rate'"
                    v-model="formData[key]"
                    v-bind="handleFormTemplateMode(key).component"
                    :colors="handleAttribute(handleFormTemplateMode(key).component.colors, ['#99A9BF', '#F7BA2A', '#FF9900'])"
                    :style="handleAttribute(handleFormTemplateMode(key).component.style, 'display: inline-block;')"
                    @change="$emit('form-data-change', { key, value })"
                  />
                  <el-color-picker
                    v-else-if="handleFormTemplateMode(key).component.name === 'el-color-picker'"
                    v-model="formData[key]"
                    v-bind="handleFormTemplateMode(key).component"
                    @change="$emit('form-data-change', { key, value })"
                  />
                  <template v-else-if="handleFormTemplateMode(key).component.name === 'text'">{{ formData[key] }}</template>
                  <render-custom-component
                    v-else-if="handleFormTemplateMode(key).component.name"
                    v-model="formData[key]"
                    :component-name="handleFormTemplateMode(key).component.name"
                    :props="handleFormTemplateMode(key).component.props ? handleFormTemplateMode(key).component.props : null"
                  />
                </slot>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button
          v-if="formOptions ? handleAttribute(formOptions.cancelButton, true) : true"
          :size="formOptions ? handleAttribute(formOptions.cancelButtonSize, null) : null"
          :type="formOptions ? handleAttribute(formOptions.cancelButtonType, 'text') : 'text'"
          :icon="formOptions ? handleAttribute(formOptions.cancelButtonIcon, null) : null"
          @click="handleCloseDialog"
        >{{ formOptions ? handleAttribute(formOptions.cancelButtonText, '取消') : '取消' }}</el-button>
        <el-button
          :size="formOptions ? handleAttribute(formOptions.saveButtonSize, null) : null"
          :type="formOptions ? handleAttribute(formOptions.saveButtonType, 'primary') : 'primary'"
          :loading="formOptions ? handleAttribute(formOptions.saveLoading, false) : false"
          :disabled="handleSaveButtonDisabled()"
          :icon="formOptions ? handleAttribute(formOptions.saveButtonIcon, null) : null"
          @click="handleDialogSave"
        >{{ formOptions ? handleAttribute(formOptions.saveButtonText, '确定') : '确定' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import base from './mixin/base'
import data from './mixin/data'
import handleRow from './mixin/handleRow'
import add from './mixin/add'
import edit from './mixin/edit'
import remove from './mixin/remove'
import pagination from './mixin/pagination'
import dialog from './mixin/dialog'
import exposeMethods from './mixin/exposeMethods.js'
import utils from './mixin/utils'
import renderCustomComponent from './components/renderCustomComponent.vue'

export default {
  name: 'S1Crud',
  components: {
    renderCustomComponent
  },
  mixins: [
    base,
    data,
    handleRow,
    add,
    edit,
    remove,
    pagination,
    dialog,
    exposeMethods,
    utils
  ]
}
</script>

<style lang="scss" scoped>
.s1-crud {
  .s1-crud-header {
    padding-bottom: 15px;
  }
  .s1-crud-body {
    padding-bottom: 15px;
    overflow: hidden;
  }
  .s1-crud-pagination {
    padding: 32px 16px;
  }
}
</style>

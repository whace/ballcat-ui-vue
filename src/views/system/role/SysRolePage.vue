<template>
  <div class="ant-pro-page-container-children-content">
    <pro-table
      ref="table"
      toolbar-title="角色管理"
      :row-key="rowKey"
      :request="tableRequest"
      :columns="columns"
      :scroll="{ x: 1100 }"
    >
      <!-- 查询表单 -->
      <template #search-form="searchFormState">
        <a-row :gutter="16">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色">
              <a-input v-model="searchFormState.queryParam.name" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="标识">
              <a-input v-model="searchFormState.queryParam.code" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item :wrapper-col="{flex: '1 1 0'}" class="search-actions-wrapper">
              <a-space>
                <a-button type="primary" :loading="searchFormState.loading" @click="searchFormState.reloadTable(true)">
                  查询
                </a-button>
                <a-button @click="searchFormState.resetSearchForm">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- 操作按钮区域 -->
      <template #toolbar-action>
        <a-button
          v-has="'system:role:add'"
          type="primary"
          icon="plus"
          @click="handleAdd()"
        >新建
        </a-button>
      </template>

      <!-- 表格展示相关插槽 -->
      <template #type-slot="text">
        <dict-tag dict-code="role_type" :value="text" />
      </template>
      <template #action-slot="text, record">
        <a v-has="'system:role:edit'" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-has="'system:role:grant'" @click="handleGrant(record)">授权</a>
        <a-divider type="vertical" />
        <a v-has="'system:role:grant'" @click="handleBind(record)">绑定</a>
        <a-divider type="vertical" />
        <a-popconfirm v-has="'system:role:del'" title="确认要删除吗？" @confirm="() => handleDel(record)">
          <a href="javascript:" class="ballcat-text-danger">删除</a>
        </a-popconfirm>
      </template>
    </pro-table>

    <!-- 表单弹窗 -->
    <role-modal-form ref="formModal" :organization-tree="organizationTree" @reload-page-table="reloadPageTable" />

    <!-- 角色授权弹窗 -->
    <role-grant-drawer ref="roleGrantDrawer" />

    <!-- 角色用户绑定弹窗 -->
    <role-user-modal ref="roleUserModal" />
  </div>
</template>

<script>
import ProTable from '@/components/Table/ProTable.js'
import { getPage, delObj } from '@/api/system/role'
import RoleModalForm from './SysRoleModalForm'
import RoleGrantDrawer from './SysRoleGrantDrawer'
import RoleUserModal from '@/views/system/role/SysRoleUserModal'
import { getTree } from '@/api/system/organization'
import { doRequest } from '@/utils/request'

export default {
  name: 'SysRolePage',
  components: {
    ProTable,
    RoleUserModal,
    RoleGrantDrawer,
    RoleModalForm
  },
  data () {
    return {
      rowKey: 'id',
      tableRequest: getPage,

      columns: [
        {
          title: '角色名称',
          dataIndex: 'name',
          sorter: true,
          width: 150,
          ellipsis: true,
        },
        {
          title: '角色标识',
          dataIndex: 'code',
          sorter: true,
          width: 180,
          ellipsis: true
        },
        {
          title: '类型',
          dataIndex: 'type',
          sorter: true,
          width: 80,
          scopedSlots: { customRender: 'type-slot' }
        },
        {
          title: '备注',
          dataIndex: 'remarks',
          sorter: true,
          width: 150,
          ellipsis: true
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 150,
          sorter: true
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width: 150,
          sorter: true
        },
        {
          key: 'operate',
          title: '操作',
          align: 'center',
          width: 180,
          scopedSlots: { customRender: 'action-slot' }
        }
      ],

      organizationTree: []
    }
  },
  created () {
    getTree().then(res => {
      this.organizationTree = res.data
    })
  },
  methods: {
    // 刷新表格
    reloadPageTable (withFirstPage = true) {
      this.$refs.table.reloadTable(withFirstPage)
    },
    // 新建角色
    handleAdd () {
      this.$refs.formModal.add({ title: '新建角色' })
    },
    // 编辑角色
    handleEdit (record) {
      this.$refs.formModal.update(record, { title: '编辑角色' })
    },
    // 对角色授权
    handleGrant (record) {
      this.$refs.roleGrantDrawer.showDrawer(record)
    },
    // 为角色做用户绑定
    handleBind (record) {
      this.$refs.roleUserModal.show(record)
    },
    // 删除
    handleDel (record) {
      doRequest(delObj(record[this.rowKey]), {
        onSuccess: () => {
          this.reloadPageTable(false)
        }
      })
    }
  }
}
</script>

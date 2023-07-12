<template>
  <div>
    <div class="card">
      <prime-toolbar class="mb-4">
        <template #start>
          <prime-button
            :label="t('table.add')" icon="pi pi-plus" class="p-button-success mr-2"
            @click="openNew" />
          <prime-button
            :label="t('table.refresh')" icon="pi pi-refresh" class="p-button-success mr-2"
            @click="fetchItems"/>
        </template>
      </prime-toolbar>
      <prime-data-table
        v-model:expandedRows="expandedRows"
        :value="content"
        data-key="id"
        :loading="loading"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink
                            CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[5,10,25]"
        current-page-report-template="Showing {first} to {last} of {totalRecords} rows"
        responsive-layout="scroll"
        @row-expand="onRowExpand"
        @row-collapse="onRowCollapse">
        <template #header>
          <div v-if="childContent" class="table-header-container">
            <prime-button class="mr-2" icon="pi pi-plus" label="Expand All" @click="expandAll" />
            <prime-button icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
          </div>
          <div class="table-header flex flex-column md:flex-row md:justiify-content-between">
            <h5 class="mb-2 md:m-0 p-as-md-center">{{ t('applicationViews.' + title) }}</h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <prime-input-text v-model="filters['global'].value" :placeholder="t('table.search')" />
            </span>
          </div>
        </template>
        <prime-column v-if="childContent.length!==0" :expander="true" header-style="width: 3rem"  />
        <prime-column
          v-for="(entry, value) in headers"
          :key="value"
          :field=entry
          :header="t(title + '.' + entry)"
          :sortable="true"
          style="min-width:12rem" />
        <prime-column :exportable="false" style="min-width:8rem">
          <template #body="slotProps">
            <prime-button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2"
              @click="editItem(slotProps.data)" />
            <prime-button
              icon="pi pi-trash"
              class="p-button-rounded p-button-warning mr-2"
              @click="confirmDeleteItem(slotProps.data)" />
          </template>
        </prime-column>

        <template v-if="childContent.length!==0" #expansion="slotProps">
          <div class="items-subtable">
            <prime-button
              :label="t('table.add')"
              icon="pi pi-plus"
              class="p-button-success mr-2"
              @click="openNewSubItem(slotProps.data)" />
            <h5>{{ childTitle }} for {{slotProps.data[mainField]}}</h5>
            <prime-data-table :value="slotProps.data[childTitle]" responsive-layout="scroll">
              <prime-column
                v-for="(entry, value) in childHeaders"
                :key=value
                :field=entry
                :header="t(childTitle + '.' + entry)"
                sortable />
            </prime-data-table>
          </div>
        </template>
      </prime-data-table>
    </div>
    <prime-dialog
      v-model:visible="childDialog"
      :style="{width: '450px'}"
      header="Role Details"
      :modal="true"
      class="p-fluid">
      <template #default>
        <div>
          <prime-pick-list v-model="child" list-style="height:342px" data-key="id">
            <template #sourceheader>
              Available
            </template>
            <template #targetheader>
              Selected
            </template>
            <template #item="slotProps">
              <div :key="slotProps.item.id" class="parent-item" >
                <div class="parent-list-detail">
                  <h6 class="mb-2">{{ slotProps.item.name }}</h6>
                </div>
              </div>
            </template>
          </prime-pick-list>
        </div>
      </template>
      <template #footer>
        <prime-button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"/>
        <prime-button
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveChild" />
      </template>
    </prime-dialog>

    <prime-dialog
      v-model:visible="parentDialog"
      :style="{width: '450px'}"
      :header="title + ' Details'"
      :modal="true"
      class="p-fluid">
      <div v-for="header in headers" :key="header" class="field" >
        <label v-if="header!=='id'" :for=header>{{ t(title+'.'+header) }}</label>
        <prime-input-text
          v-if="header!=='id' && header!=='routeName'"
          :id=header
          v-model.trim="parent[header]"
          required="true"
          autofocus
          :class="{'p-invalid':submitted && !parent[header]}" />
        <prime-dropdown
          v-if="header==='routeName'"
          v-model="parent[header]"
          :options="routes"
          :editable="true"
          option-label="name"
          option-value="name"
          :placeholder="parent[header]" />
        <small v-if="submitted && !parent[header] && header!=='id'" class="p-error" >
          {{ t(title+'.'+mainField) }} is required.</small>
      </div>
      <template #footer>
        <prime-button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
        <prime-button label="Save" icon="pi pi-check" class="p-button-text" @click="saveItem" />
      </template>
    </prime-dialog>

    <prime-dialog v-model:visible="deleteItemDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="parent">Are you sure you want to delete
          <b>{{parent[mainField]}}</b>?</span>
      </div>
      <template #footer>
        <prime-button label="No" icon="pi pi-times" class="p-button-text" @click="deleteItemDialog = false"/>
        <prime-button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteItemFnc" />
      </template>
    </prime-dialog>
  </div>
</template>

<script lang="ts">
import {ref} from 'vue'
import {useI18n} from "vue-i18n"
import { FilterMatchMode } from 'primevue/api'
import { info, success } from '@/composables/showToastMessage'
import PrimeDialog from 'primevue/dialog'
import PrimeButton from 'primevue/button'
import PrimeToolbar from 'primevue/toolbar'
import PrimeDataTable from 'primevue/datatable'
import PrimeInputText from 'primevue/inputtext'
import PrimeColumn from 'primevue/column'
import PrimePickList from 'primevue/picklist'
import PrimeDropdown from 'primevue/dropdown'

export default {
  name: "TheTable",
  components: {
    PrimeDialog,
    PrimeButton,
    PrimeToolbar,
    PrimeDataTable,
    PrimeInputText,
    PrimeColumn,
    PrimePickList,
    PrimeDropdown
  },
  props: {
    tableName: {
      type: String,
      require: true,
      default: 'ERROR'
    },
    childTableName: {
      type: String,
      default: 'ERROR'
    },
    title: {
      type: String,
      require: true,
      default: 'ERROR'
    },
    mainField: {
      type: String,
      require: true,
      default: 'ERROR'
    },
    idField: {
      type: String,
      require: true,
      default: 'ERROR'
    },
    childTitle: {
      type: String,
      default: 'ERROR'
    },
    headers: {
      type: Object,
      default(): void {}
    },
    childHeaders: {
      type: Object,
      default(): void {}
    },
    content: {
      require: true,
      default: [],
      type: Array<any>
    },
    childContent: {
      default: [],
      type: Array<any>
    },
    itemType: {
      type: String,
      require: true,
      default: 'ERROR'
    },
    routes: {
      default: [],
      type: Array<any>
    }
  },

  emits: ['fetchItems', 'newItem', 'deleteItem'],

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  setup (props: any, context: any) {
    const { t } = useI18n({ useScope: 'global' })
    const loading = ref(false);
    const submitted = ref(false);
    const parent: {[key: string]: any} = ref({} )
    const parents = ref(props.content)
    const child = ref([[], []])
    const parentDialog = ref(false)
    const deleteItemDialog = ref(false)
    const childDialog = ref(false)
    const expandedRows = ref([]);

    const onRowExpand = (event: any): void => {
      info(props.tableName + ' Expanded', event.data.name,1000);
    };
    const onRowCollapse = (event: any): void => {
      success(props.tableName + ' Collapsed', event.data.name, 1000);
    };
    const expandAll = (): void => {
      expandedRows.value = props.content.filter((p: any) => p.id);
      success('All Rows Expanded', 'All Rows Expanded', 1000);
    };
    const collapseAll = (): void => {
      expandedRows.value = [];
      success('All Rows Expanded', 'All Rows Expanded', 1000);
    };
    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    })

    const openNew = (): void => {
      parent.value = {};
      submitted.value = false;
      parentDialog.value = true;
    };

    const openNewSubItem = (row: Array<any>): void => {
      parent.value = {...row};
      child.value = [props.childContent, []]
      const removeItems = (array: any, itemsToRemove: any): any => {
        return array.filter((v: any) => {
          return !(itemsToRemove === v.id)
        });
      }
      for (const i of parent.value[props.childTitle as keyof typeof parent.value] as any) {
        child.value = [removeItems(child.value[0], i.id),
                       parent.value[props.childTitle as keyof typeof parent.value] as any]
      }
      submitted.value = false;
      childDialog.value = true;
    }

    function fetchItems (): void {
      context.emit('fetchItems')
    }

    const saveItem = (): void => {
      loading.value = true;
      submitted.value = true;
      if ((parent.value[props.mainField as keyof typeof parent.value] as any).trim()) {
        if (parent.value[props.idField as keyof typeof parent.value] as any ) {
          context.emit('newItem', parent.value)
          parents.value[findIndexById(parent.value[props.idField as keyof typeof parent.value] as any)] = parent.value
          success('Successful', props.tableName + ' Updated', 1000)
        } else {
          context.emit('newItem', parent.value)
          success('Successful', props.tableName + ' Created', 1000)
        }
        parentDialog.value = false
        parent.value = {}
        loading.value = false
      }
    }

    const editItem = (row: Array<any>): void => {
      parent.value = {...row};
      parentDialog.value = true;
    };

    const confirmDeleteItem = (row: Array<any>): void => {
      parent.value = row
      deleteItemDialog.value = true
    };

    const saveChild = (): void =>{
      loading.value = true;
      submitted.value = true;
      (parent.value[props.childTitle as keyof typeof parent.value] as any) = child.value[1]
      if ((parent.value[props.mainField as keyof typeof parent.value] as any).trim()) {
        context.emit('newItem', parent.value)
        parents.value[findIndexById(parent.value[props.idField as keyof typeof parent.value] as any)] = parent.value
        success('Successful', props.title +' Updated', 1000)
        childDialog.value = false
        parent.value = {}
      }
      loading.value = false
    }

    const deleteItemFnc = (): void => {
      loading.value = true;
      context.emit('deleteItem', parent.value, parent.value[props.idField as keyof typeof parent.value] as any)
      deleteItemDialog.value = false
      parent.value = {}
      success('Successful', 'User Deleted', 3000);
      loading.value = false
    }

    const hideDialog = (): void => {
      parentDialog.value = false;
      childDialog.value = false;
      submitted.value = false;
    };

    const findIndexById = (id: number): number => {
      let index = -1;
      for (let i = 0; i < props.content.length; i++) {
        if (props.content[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    }

    return {
      t,
      loading,
      submitted,
      filters,
      expandedRows,
      parentDialog,
      deleteItemDialog,
      childDialog,
      parent,
      child,
      onRowExpand,
      onRowCollapse,
      expandAll,
      collapseAll,
      openNew,
      openNewSubItem,
      fetchItems,
      saveItem,
      editItem,
      deleteItemFnc,
      confirmDeleteItem,
      hideDialog,
      saveChild
    }
  }
}
</script>

<style lang="scss" src="./TheTable.scss" scoped>
</style>

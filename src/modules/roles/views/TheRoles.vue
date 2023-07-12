<template>
  <the-table
    table-name="Role"
    item-type="Roles"
    main-field="name"
    id-field="id"
    title="roles"
    :headers="getResponsibilitiesHeaders"
    :content="getResponsibilities"
    @fetch-items = 'fetchResponsibilities'
    @new-item = 'newResponsibility'
    @delete-item="deleteResponsibility"
  />
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue'
import theTable from '@/components/tables/TheTable.vue'
import { responsibilitiesStore } from '@/modules/roles/stores'
import { storeToRefs } from 'pinia'
export default defineComponent( {
  name: "TheRoles",
  components: {
    theTable
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  setup () {
    onMounted(() => {
      fetchResponsibilities()
    })
    const { fetchResponsibilities, newResponsibility, deleteResponsibility } = responsibilitiesStore()
    const { getResponsibilities, getResponsibilitiesHeaders } = storeToRefs(responsibilitiesStore())

    return {
      getResponsibilities,
      getResponsibilitiesHeaders,
      fetchResponsibilities,
      newResponsibility,
      deleteResponsibility
    }
  }
})
</script>

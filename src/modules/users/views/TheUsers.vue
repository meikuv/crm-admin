<template>
  <the-table
    table-name="User"
    item-type="Users"
    main-field="login"
    id-field="id"
    child-table-name="Role"
    title="users"
    child-title="roles"
    :headers="getHeaders"
    :child-headers="getResponsibilitiesHeaders"
    :content="getUsers"
    :child-content="getResponsibilities"
    @fetch-items = 'fetchUsers'
    @new-item = 'newUser'
    @delete-item="deleteUser"
  />
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue'
import theTable from '@/components/tables/TheTable.vue'
import { usersStore } from '@/modules/users/stores'
import { responsibilitiesStore } from '@/modules/roles/stores'
import { storeToRefs } from 'pinia'

export default defineComponent( {
  name: 'TheUsers',
  components: {
    theTable
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  setup () {
    onMounted(() => {
      fetchUsers()
      fetchResponsibilities()
    })

    const { fetchUsers, newUser, deleteUser } = usersStore()
    const { getUsers, getHeaders } = storeToRefs(usersStore())
    const { fetchResponsibilities } = responsibilitiesStore()
    const { getResponsibilities, getResponsibilitiesHeaders } = storeToRefs(responsibilitiesStore())

    return {
      getUsers,
      getHeaders,
      getResponsibilities,
      getResponsibilitiesHeaders,
      fetchUsers,
      newUser,
      deleteUser
    }
  }
})
</script>

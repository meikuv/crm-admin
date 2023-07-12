<template>
  <the-table
    table-name="View"
    item-type = "Views"
    main-field="name"
    id-field="id"
    title="views"
    :headers="getViewsHeaders"
    :content="getViews"
    child-table-name="Role"
    child-title="roles"
    :routes="availableRoutes"
    :child-headers="getResponsibilitiesHeaders"
    :child-content="getResponsibilities"
    @fetch-items = 'fetchViews'
    @new-item = 'newView'
    @delete-item="deleteView"
  />
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue'
import theTable from '@/components/tables/TheTable.vue'
import { viewsStore } from '@/modules/views/stores/'
import { storeToRefs } from 'pinia'
import {responsibilitiesStore} from "@/modules/roles/stores/";
import { useRouter } from "vue-router";
export default defineComponent( {
  name: "TheViews",
  components: {
    theTable
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  setup () {
    onMounted(() => {
      fetchViews()
      fetchResponsibilities()
    })
    const router = useRouter()
    const availableRoutes = router.options.routes[1].children
    const { fetchViews, newView, deleteView } = viewsStore()
    const { getViews, getViewsHeaders } = storeToRefs(viewsStore())
    const { fetchResponsibilities } = responsibilitiesStore()
    const { getResponsibilities, getResponsibilitiesHeaders } = storeToRefs(responsibilitiesStore())
    return {
      getViews,
      getViewsHeaders,
      getResponsibilities,
      getResponsibilitiesHeaders,
      fetchResponsibilities,
      fetchViews,
      newView,
      deleteView,
      availableRoutes
    }
  }
})
</script>

<template>
  <the-table
    table-name="Screen"
    item-type="Screens"
    main-field="name"
    id-field="id"
    child-table-name="View"
    title="screens"
    child-title="views"
    :headers="getScreensHeaders"
    :child-headers="getViewsHeaders"
    :content="getScreens"
    :child-content="getViews"
    @fetch-items = 'fetchScreens'
    @new-item = 'newScreen'
    @delete-item="deleteScreen"
  />
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue'
import theTable from '@/components/tables/TheTable.vue'
import { screensStore } from '@/modules/screens/stores/'
import { viewsStore } from '@/modules/views/stores/'
import { storeToRefs } from 'pinia'

export default defineComponent( {
  name: 'TheScreens',
  components: {
    theTable
  },
  setup () {
    onMounted(() => {
      fetchScreens()
      fetchViews()
    })

    const { fetchScreens, newScreen, deleteScreen } = screensStore()
    const { getScreens, getScreensHeaders } = storeToRefs(screensStore())
    const { fetchViews } = viewsStore()
    const { getViews, getViewsHeaders } = storeToRefs(viewsStore())

    return {
      getScreens,
      getScreensHeaders,
      getViews,
      getViewsHeaders,
      fetchScreens,
      newScreen,
      deleteScreen
    }
  }
})
</script>

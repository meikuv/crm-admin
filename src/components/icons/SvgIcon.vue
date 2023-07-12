<template>
  <component :is="name" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as icons from './variants'
export default defineComponent({
  name: 'SvgIcon',
  components: {
    ...icons,
  },
  props: {
    name: {
      type: String,
      required: true,
      validator(value: string): boolean {
        return Object.keys(icons).includes(value)
      },
    },
  },
})
</script>

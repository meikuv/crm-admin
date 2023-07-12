<template>
  <div class="menu-list-select">
    <button :class="`p-button text-sm ${props.togglerClass}`" @click.prevent="toggleExpandSelect">
      {{ props.tag }}
    </button>
    <p-overlay-panel ref="menuListItemsE" show-close-icon :base-z-index="100">
      <div v-if="props.items.length" class="menu-list-select__items-wrapper row">
        <div
          v-for="(letterGroups, index) in itemGroups"
          :key="index + getContainsLetter(letterGroups)"
          class="col-xs-3"
        >
          <menu-list-select-item
            v-for="letter in Object.keys(letterGroups)"
            :key="index + letter"
            :items="letterGroups[letter]"
            :letter="letter"
            :value="props.modelValue"
            @update="updateVmodel($event)"
          />
        </div>
      </div>
      <div v-else class="px-3">
        <div class="w-4rem">
          <p-progress-spinner class="w-full" />
        </div>
      </div>
    </p-overlay-panel>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, PropType } from 'vue'
import { groupWordsByFirstLetter, IGroupedWordsByLetter } from '@/utils/arrayUtils'
import MenuListSelectItem from './MenuListSelectItem.vue'
import POverlayPanel from 'primevue/overlaypanel'
import PProgressSpinner from 'primevue/progressspinner'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: '',
    required: true,
  },
  items: {
    type: Array as PropType<string[]>,
    default: () => [],
    required: true,
  },
  columnsCount: {
    type: Number,
    default: 4,
    required: false,
  },
  togglerClass: {
    type: String,
    default: '',
    required: false,
  },
})

const menuListItemsE = ref<POverlayPanel>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const getContainsLetter = (obj: Object): string => {
  return Object.keys(obj).join('')
}

const updateVmodel = (selectedValue: string): void => {
  const emitValue: string = selectedValue === props.modelValue ? '' : selectedValue
  emit('update:modelValue', emitValue)
  emit('change', emitValue)
}

const columns = computed<string[][]>(() => {
  const chunkSize: number = Math.floor(props.items.length / props.columnsCount)
  if (chunkSize <= 1) return [props.items]
  const chunks: string[][] = []
  let iterateIndex: number = 0
  for (let i = 0; i < props.items.length; i += chunkSize) {
    const chunk = props.items.slice(i, i + chunkSize)
    if (chunks.length === props.columnsCount && chunk.length <= chunkSize / 2) {
      chunks[iterateIndex - 1].concat(chunk)
    } else {
      chunks.push(chunk)
    }
    iterateIndex++
  }
  return chunks
})

const itemGroups = computed<IGroupedWordsByLetter[]>(() => {
  return columns.value.map(chunk => groupWordsByFirstLetter(chunk))
})

const toggleExpandSelect = (e: any): void => {
  menuListItemsE.value?.toggle(e)
}
</script>

<style lang="scss">
.menu-list-select__items-wrapper {
  padding: 2em 2em 1em 2em;
}
</style>

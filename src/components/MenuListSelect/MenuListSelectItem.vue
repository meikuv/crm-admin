<template>
  <div class="menu-list__items-card">
    <span class="menu-list__items-first-letter">{{ props.letter }}</span>
    <ul class="menu-list__items">
      <li v-for="item in props.items" :key="item" class="menu-list__item">
        <p-button
          :class="[
            'p-button-sm text-left',
            props.value === item && 'p-button-info',
            props.value !== item && 'p-button-link',
          ]"
          @click="emit('update', item)"
        >
          <span class="menu-list__item-text">{{ item }}</span>
        </p-button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import PButton from 'primevue/button'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  letter: {
    type: String,
    default: '',
    required: false,
  },
  items: {
    type: Array as PropType<string[]>,
    default: () => [],
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'update', value: string): void
}>()
</script>

<style lang="scss">
.menu-list__items {
  list-style: none;
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-left: 1rem;
}

.menu-list__items-card {
  position: relative;
}

.menu-list__items-first-letter {
  position: absolute;
  font-weight: 500;
  color: var(--surface-400);
  top: 6px;
}

.menu-list__item-text {
  text-align: left;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
}
</style>

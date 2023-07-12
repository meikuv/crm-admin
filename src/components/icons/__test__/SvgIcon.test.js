import { screen, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import svgIcon from '../SvgIcon.vue'

describe('SvgIcon.vue', () => {
  expect(svgIcon).toBeTruthy()

  it('Icon is rendered with icon name', () => {
    const opt = {
      props: {
        name: 'logoutBtn',
      },
    }
    render(svgIcon, opt)
    screen.getByText('Выход')
  })
})

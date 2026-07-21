import { mount } from '@vue/test-utils'
import BaseCard from '@/components/UI/BaseCard.vue'

describe('BaseCard.vue', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseCard, {
      slots: { default: 'card content' }
    })
    expect(wrapper.text()).toMatch('card content')
  })
})

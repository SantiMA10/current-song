import { shallowMount } from '@vue/test-utils';
import Welcome from '~/components/Welcome.vue';

describe('Welcome', () => {
  it('renders', () => {
    const subject = shallowMount(Welcome);

    expect(subject.element).toMatchSnapshot();
  });
});
